'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useLabStore } from '@/store/labStore';
import { ParticleEmitter } from '@/utils/particleSystem';
import { AnimationEngine } from '@/utils/animationEngine';
import { AnimationConfig } from '@/types/animations';

export default function BeakerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emitterRef = useRef<ParticleEmitter | null>(null);
  const engineRef = useRef<AnimationEngine | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastReactionIdRef = useRef<string | null>(null);
  
  // State for overlay effects that need CSS/SVG handling
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});

  const beakerState = useLabStore(state => state.beakerState);
  const currentReaction = useLabStore(state => state.currentReaction);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      
      if (emitterRef.current) {
        // Re-init emitter with new size
        emitterRef.current = new ParticleEmitter(canvas.width, canvas.height);
        // Re-init engine
        engineRef.current = new AnimationEngine(emitterRef.current, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize systems
    emitterRef.current = new ParticleEmitter(canvas.width, canvas.height);
    engineRef.current = new AnimationEngine(emitterRef.current, canvas.width, canvas.height);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas || !engineRef.current || !emitterRef.current) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update animation engine
      engineRef.current.update();

      // Draw beaker liquid
      drawLiquid(ctx, canvas);

      // Draw particles
      emitterRef.current.update();
      emitterRef.current.draw(ctx);

      // Draw thermometer
      drawThermometer(ctx, canvas);
      
      // Update overlay styles from engine
      if (currentReaction?.id) {
        const overlayColor = engineRef.current.getOverlayColor(currentReaction.id);
        if (overlayColor) {
          setOverlayStyle({
            backgroundColor: overlayColor,
            transition: 'background-color 0.1s ease'
          });
        } else {
          setOverlayStyle({});
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Trigger animations when reaction changes
  useEffect(() => {
    if (currentReaction && currentReaction.id !== lastReactionIdRef.current) {
      lastReactionIdRef.current = currentReaction.id;
      
      if (engineRef.current && currentReaction.animationConfig) {
        // Cast to AnimationConfig to ensure type compatibility
        // The JSON data might be loosely typed, so we trust it matches the interface
        engineRef.current.playAnimation(currentReaction.id, currentReaction.animationConfig as AnimationConfig);
      }
    } else if (!currentReaction) {
      lastReactionIdRef.current = null;
    }
  }, [currentReaction]);

  const drawLiquid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const liquidLevel = beakerState.volume / 100;
    const liquidHeight = canvas.height * liquidLevel;
    const liquidY = canvas.height - liquidHeight;

    if (liquidHeight > 0) {
      // Create gradient for liquid
      const gradient = ctx.createLinearGradient(0, liquidY, 0, canvas.height);
      gradient.addColorStop(0, beakerState.color);
      // Simple darkening for depth
      gradient.addColorStop(1, adjustColorBrightness(beakerState.color, -20));

      // Draw liquid
      ctx.fillStyle = gradient;
      ctx.fillRect(canvas.width * 0.15, liquidY, canvas.width * 0.7, liquidHeight);

      // Draw liquid surface (glossy effect)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.15, liquidY);
      ctx.lineTo(canvas.width * 0.85, liquidY);
      ctx.stroke();
    }
  };

  const drawThermometer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const x = canvas.width * 0.9;
    const y = 20;
    const width = 20;
    const height = 100;

    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Mercury level based on temperature
    const temp = beakerState.temperature;
    const normalizedTemp = Math.max(0, Math.min(100, temp)) / 100;
    const mercuryHeight = height * normalizedTemp;

    const mercuryColor = temp > 50 ? '#ef4444' : temp > 30 ? '#f97316' : '#3b82f6';
    ctx.fillStyle = mercuryColor;
    ctx.fillRect(x, y + height - mercuryHeight, width, mercuryHeight);

    // Temperature text
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(temp)}°C`, x + width / 2, y + height + 15);
  };

  const adjustColorBrightness = (color: string, amount: number): string => {
    if (!color.startsWith('#')) return color; // Skip if not hex
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Overlay for global effects (flash, glow, etc.) */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={overlayStyle}
      />
      
      {/* Beaker outline SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Beaker shape */}
        <path
          d="M 15 0 L 15 100 L 85 100 L 85 0 Z"
          fill="none"
          stroke="#374151"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Volume markers */}
        {[25, 50, 75].map(level => (
          <line
            key={level}
            x1="85"
            y1={level}
            x2="90"
            y2={level}
            stroke="#6b7280"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
