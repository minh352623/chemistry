'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FlameEffectProps {
  duration?: number;
}

export default function FlameEffect({ duration = 3000 }: FlameEffectProps) {
  const [flames, setFlames] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    const newFlames = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 40,
      delay: Math.random() * 0.3
    }));
    setFlames(newFlames);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {flames.map((flame) => (
        <motion.div
          key={flame.id}
          className="absolute"
          style={{ 
            left: `${flame.x}%`,
            bottom: '20%',
            width: 20 + Math.random() * 20,
            height: 30 + Math.random() * 30
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1, 1.2, 0],
            y: [0, -80, -120, -150]
          }}
          transition={{
            duration: 1.5,
            delay: flame.delay,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        >
          <div className="w-full h-full bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm" />
        </motion.div>
      ))}
      
      {/* Heat waves */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent" />
      </motion.div>
      
      {/* Combustion text */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-orange-400 font-bold text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 1, 1], y: [20, 0] }}
        transition={{ duration: 1 }}
      >
        🔥 Combustion
      </motion.div>
    </div>
  );
}
