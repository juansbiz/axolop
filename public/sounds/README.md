# Phone System Sound Files

This directory should contain the following audio files for the dialer:

## Required Files

1. **ringtone.mp3** - Plays when receiving an incoming call
   - Recommended duration: 3-5 seconds, loopable
   - Should be pleasant and professional

2. **ringback.mp3** - Plays while waiting for the other party to answer (outbound calls)
   - Recommended duration: 3-5 seconds, loopable
   - Traditional ringback tone

## Adding Sound Files

1. Place your audio files in this directory
2. Ensure they are named exactly as listed above
3. Use MP3 format for best browser compatibility
4. Keep file sizes small (under 500KB recommended)

## Free Resources for Ringtones

- [freesound.org](https://freesound.org) - Free sound effects (check license)
- [zapsplat.com](https://zapsplat.com) - Royalty-free sounds
- Standard telephone tones can be generated with audio software

## Notes

- The dialer will gracefully handle missing sound files
- Browser autoplay policies may prevent audio from playing without user interaction
- Volume is set to 50% by default in the IncomingCallModal component
