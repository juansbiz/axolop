import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Share2,
  MessageSquare,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AudioWaveform Component
 *
 * Audio player with waveform visualization for call recordings.
 *
 * Features:
 * - Play/pause controls
 * - Seek by clicking waveform
 * - Volume control
 * - Download button
 * - Share button
 * - Add note button
 * - Duration display
 * - Skip forward/back 10s
 */

// Generate fake waveform data for visualization
// In production, this would be generated from actual audio analysis
const generateWaveformData = (length = 50) => {
  return Array.from({ length }, () => 0.3 + Math.random() * 0.7);
};

// Format seconds to MM:SS
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function AudioWaveform({
  src,
  duration: initialDuration = 0,
  title,
  date,
  onAddNote,
  onShare,
  onDownload,
  showActions = true,
  compact = false,
  className,
}) {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [waveformData] = useState(() => generateWaveformData(compact ? 30 : 50));

  // Refs
  const audioRef = useRef(null);
  const waveformRef = useRef(null);

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Seek to position
  const seekTo = useCallback((e) => {
    const audio = audioRef.current;
    const waveform = waveformRef.current;
    if (!audio || !waveform) return;

    const rect = waveform.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audio.currentTime = Math.max(0, Math.min(newTime, duration));
  }, [duration]);

  // Skip forward/back
  const skip = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = audio.currentTime + seconds;
    audio.currentTime = Math.max(0, Math.min(newTime, duration));
  }, [duration]);

  // Volume control
  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    } else if (src) {
      const a = document.createElement('a');
      a.href = src;
      a.download = title || 'recording.mp3';
      a.click();
    }
  }, [src, title, onDownload]);

  // Compact version
  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-3 p-2 bg-gray-50 rounded-lg",
        className
      )}>
        {/* Hidden audio element */}
        <audio ref={audioRef} src={src} preload="metadata" />

        {/* Play button */}
        <button
          onClick={togglePlay}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            "bg-[#3F0D28] text-white",
            "hover:bg-[#5B1046] transition-colors"
          )}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {/* Mini waveform */}
        <div
          ref={waveformRef}
          onClick={seekTo}
          className="flex-1 h-6 flex items-center gap-px cursor-pointer"
        >
          {waveformData.map((height, i) => {
            const isPlayed = (i / waveformData.length) * 100 <= progress;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-full transition-colors",
                  isPlayed ? "bg-[#3F0D28]" : "bg-gray-300"
                )}
                style={{ height: `${height * 100}%` }}
              />
            );
          })}
        </div>

        {/* Time */}
        <span className="text-xs text-gray-500 tabular-nums w-10">
          {formatTime(currentTime)}
        </span>
      </div>
    );
  }

  // Full version
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 overflow-hidden",
      className
    )}>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Header */}
      {(title || date) && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {title && (
              <p className="font-medium text-gray-900 truncate">{title}</p>
            )}
            {date && (
              <p className="text-xs text-gray-500">{date}</p>
            )}
          </div>
        </div>
      )}

      {/* Waveform */}
      <div className="p-4">
        <div
          ref={waveformRef}
          onClick={seekTo}
          className="h-16 flex items-center gap-0.5 cursor-pointer group"
        >
          {waveformData.map((height, i) => {
            const isPlayed = (i / waveformData.length) * 100 <= progress;
            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.01 }}
                className={cn(
                  "flex-1 rounded-full transition-colors",
                  isPlayed ? "bg-[#3F0D28]" : "bg-gray-300 group-hover:bg-gray-400"
                )}
                style={{ height: `${height * 100}%` }}
              />
            );
          })}
        </div>

        {/* Time display */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span className="tabular-nums">{formatTime(currentTime)}</span>
          <span className="tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          {/* Playback controls */}
          <div className="flex items-center gap-2">
            {/* Skip back */}
            <button
              onClick={() => skip(-10)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back 10s"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                "bg-gradient-to-b from-[#8B4F7A] via-[#5B1046] to-[#3F0D28]",
                "text-white shadow-lg shadow-[#3F0D28]/30",
                "hover:shadow-[#3F0D28]/50 transition-shadow"
              )}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {/* Skip forward */}
            <button
              onClick={() => skip(10)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Forward 10s"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-[#3F0D28]"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}

          {onAddNote && (
            <button
              onClick={onAddNote}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Add Note</span>
            </button>
          )}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="px-4 pb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#3F0D28] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Simple audio player without waveform
export function SimpleAudioPlayer({
  src,
  duration: initialDuration,
  className,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-[#3F0D28] text-white flex items-center justify-center hover:bg-[#5B1046] transition-colors"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3F0D28] rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-xs text-gray-500 tabular-nums min-w-[40px]">
        {formatTime(duration - currentTime)}
      </span>
    </div>
  );
}
