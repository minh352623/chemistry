'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PrecipitateEffectProps {
  color?: string;
  duration?: number;
}

export default function PrecipitateEffect({ 
  color = '#ffffff',
  duration = 3000 
}: PrecipitateEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      delay: Math.random() * 0.8
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute top-0 rounded-full"
          style={{ 
            left: `${particle.x}%`,
            backgroundColor: color,
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, 300],
            opacity: [0, 1, 1, 0.5],
            rotate: [0, 360]
          }}
          transition={{
            duration: 2,
            delay: particle.delay,
            ease: 'easeIn'
          }}
        />
      ))}
      
      {/* Cloud effect at bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 rounded-full blur-xl"
        style={{ backgroundColor: color }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.4, 0.6], scale: [0, 1, 1.2] }}
        transition={{ duration: 2 }}
      />
      
      {/* Precipitate text */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: [0, 1, 1], y: [-20, 0] }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        💧 Precipitate Forms
      </motion.div>
    </div>
  );
}
