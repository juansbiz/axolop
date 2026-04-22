/**
 * Confetti Component
 *
 * Gorgeous confetti explosion for celebrations
 * Fires on form publish, save milestones, etc.
 * Uses canvas for smooth 60fps animations
 */

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useAccessibility';

export function Confetti({ active, duration = 3000, onComplete }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;

    // Skip confetti if user prefers reduced motion
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Confetti particles
    const particles = [];
    const particleCount = 150;
    const colors = ['#FF6B9D', '#C44569', '#FFA07A', '#FFD93D', '#6BCF7F', '#4ECDC4', '#45B7D1'];

    class ConfettiParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.opacity = 1;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.1; // Gravity

        // Fade out near bottom
        if (this.y > canvas.height * 0.8) {
          this.opacity -= 0.02;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new ConfettiParticle());
    }

    let animationFrame;
    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;

      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onComplete) onComplete();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Remove particles that are off screen or fully transparent
        if (particle.y > canvas.height + 10 || particle.opacity <= 0) {
          particles[index] = new ConfettiParticle();
        }
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [active, duration, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}

/**
 * useConfetti Hook
 *
 * Easy way to trigger confetti from any component
 */
export function useConfetti() {
  const [isActive, setIsActive] = React.useState(false);

  const fire = React.useCallback((duration = 3000) => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), duration);
  }, []);

  return { isActive, fire };
}
