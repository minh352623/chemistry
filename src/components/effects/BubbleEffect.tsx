'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BubbleEffectProps {
  duration?: number;
}

export default function BubbleEffect({ duration = 3000 }: BubbleEffectProps) {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bottom-0 w-3 h-3 bg-cyan-400/60 rounded-full"
          style={{ left: `${bubble.x}%` }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: [-20, -200],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.5, 0]
          }}
          transition={{
            duration: 2,
            delay: bubble.delay,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
        />
      ))}
      
      {/* Gas text effect */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-cyan-400 font-bold text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 1, 1, 0], y: [20, -40] }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        🌫️ Gas Evolved
      </motion.div>
    </div>
  );
}
