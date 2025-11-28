'use client';

import { motion } from 'framer-motion';

interface ColorChangeEffectProps {
  fromColor?: string;
  toColor?: string;
  duration?: number;
}

export default function ColorChangeEffect({
  fromColor = '#3b82f6',
  toColor = '#8b5cf6',
  duration = 2000
}: ColorChangeEffectProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Color gradient sweep */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 2 }}
      />
      
      {/* Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 2 === 0 ? fromColor : toColor
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.5,
            repeat: 1
          }}
        />
      ))}
      
      {/* Text effect */}
      <motion.div
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-purple-400 font-bold text-lg"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 1] }}
        transition={{ duration: 2 }}
      >
        🎨 Color Change
      </motion.div>
    </div>
  );
}
