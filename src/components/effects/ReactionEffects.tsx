'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BubbleEffect from './BubbleEffect';
import PrecipitateEffect from './PrecipitateEffect';
import ColorChangeEffect from './ColorChangeEffect';
import FlameEffect from './FlameEffect';

interface ReactionEffectsProps {
  types: string[];
  precipitate?: { compound: string; color: string };
  gas?: { compound: string };
  show: boolean;
  onComplete?: () => void;
}

export default function ReactionEffects({
  types,
  precipitate,
  gas,
  show,
  onComplete
}: ReactionEffectsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  const hasCombustion = types.includes('combustion');
  const hasPrecipitation = types.includes('precipitation') || precipitate;
  const hasGas = gas !== undefined;
  const hasRedox = types.includes('redox');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Center container for effects */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
            {hasCombustion && <FlameEffect />}
            {hasPrecipitation && (
              <PrecipitateEffect color={precipitate?.color || '#ffffff'} />
            )}
            {hasGas && <BubbleEffect />}
            {hasRedox && !hasCombustion && <ColorChangeEffect />}
            
            {/* Sparkle effects for redox */}
            {hasRedox && (
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1,
                      delay: Math.random() * 0.5,
                      repeat: 2
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full blur-sm" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Reaction type badge */}
          <motion.div
            className="absolute top-20 left-1/2 transform -translate-x-1/2"
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="px-8 py-4 bg-gradient-to-r from-cyan-500/90 to-purple-500/90 backdrop-blur-sm rounded-full shadow-2xl border border-white/20">
              <h3 className="text-white font-bold text-2xl text-center">
                {hasCombustion && '🔥 Combustion!'}
                {hasPrecipitation && !hasCombustion && '💧 Precipitation!'}
                {hasGas && !hasPrecipitation && !hasCombustion && '🌫️ Gas Evolution!'}
                {hasRedox && !hasCombustion && !hasPrecipitation && !hasGas && '⚡ Redox Reaction!'}
                {!hasCombustion && !hasPrecipitation && !hasGas && !hasRedox && '⚗️ Chemical Reaction!'}
              </h3>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
