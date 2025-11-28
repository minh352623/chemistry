'use client';

import React, { useEffect, useState } from 'react';
import { useLabStore } from '@/store/labStore';
import { Reaction } from '@/types/chemistry';

export default function ReactionPanel() {
  const currentReaction = useLabStore(state => state.currentReaction);
  const [isVisible, setIsVisible] = useState(false);
  const [displayReaction, setDisplayReaction] = useState<Reaction | null>(null);

  useEffect(() => {
    if (currentReaction) {
      setDisplayReaction(currentReaction);
      setIsVisible(true);
    } else {
      // Delay hiding to allow exit animation
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [currentReaction]);

  if (!isVisible || !displayReaction) {
    return null;
  }

  const getReactionTypeColor = (type: string): string => {
    switch (type) {
      case 'neutralization': return 'bg-blue-500';
      case 'precipitation': return 'bg-purple-500';
      case 'gas-evolution': return 'bg-cyan-500';
      case 'color-change': return 'bg-pink-500';
      case 'combustion': return 'bg-red-500';
      case 'redox': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getReactionTypeIcon = (type: string): string => {
    switch (type) {
      case 'neutralization': return '⚖️';
      case 'precipitation': return '⬇️';
      case 'gas-evolution': return '💨';
      case 'color-change': return '🎨';
      case 'combustion': return '🔥';
      case 'redox': return '⚡';
      default: return '🧪';
    }
  };

  return (
    <div
      className={`
        transition-all duration-500 ease-out
        ${currentReaction ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-indigo-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>{getReactionTypeIcon(displayReaction.type)}</span>
            Reaction Detected!
          </h2>
          <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getReactionTypeColor(displayReaction.type)}`}>
            {displayReaction.type}
          </div>
        </div>

        {/* Chemical Equation */}
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Chemical Equation:</p>
          <p className="text-lg font-mono text-indigo-900 font-bold">
            {displayReaction.equation}
          </p>
        </div>

        {/* Products */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 mb-2 font-semibold">Products Formed:</p>
          <div className="flex flex-wrap gap-2">
            {displayReaction.products.map((product, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-mono font-semibold"
              >
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-4 p-4 bg-blue-50 rounded-xl">
          <p className="text-xs text-gray-700 mb-1 font-semibold">📚 Explanation:</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {displayReaction.explanation}
          </p>
        </div>

        {/* Visual Effects Summary */}
        {displayReaction.effects && (
          <div className="mb-4 p-3 bg-purple-50 rounded-xl">
            <p className="text-xs text-gray-700 mb-2 font-semibold">🎭 Observed Effects:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {displayReaction.effects.colorChange && (
                <li>• Color change detected</li>
              )}
              {displayReaction.effects.bubbles && displayReaction.effects.bubbles !== 'none' && (
                <li>• Bubbles forming ({displayReaction.effects.bubbles})</li>
              )}
              {displayReaction.effects.precipitate && (
                <li>• Precipitate forming ({displayReaction.effects.precipitate.amount})</li>
              )}
              {displayReaction.effects.gas && (
                <li>• Gas released: {displayReaction.effects.gas.type}</li>
              )}
              {displayReaction.effects.temperatureChange && displayReaction.effects.temperatureChange !== 0 && (
                <li>
                  • Temperature {displayReaction.effects.temperatureChange > 0 ? 'increased' : 'decreased'} by {Math.abs(displayReaction.effects.temperatureChange)}°C
                  ({displayReaction.effects.temperatureChange > 0 ? 'Exothermic' : 'Endothermic'})
                </li>
              )}
              {displayReaction.effects.explosion && (
                <li className="text-red-600 font-bold">⚠️ Explosive reaction!</li>
              )}
            </ul>
          </div>
        )}

        {/* Safety Warning */}
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
          <p className="text-xs text-red-700 mb-1 font-semibold">⚠️ Safety Note:</p>
          <p className="text-sm text-red-700 font-medium">
            {displayReaction.safety}
          </p>
        </div>
      </div>
    </div>
  );
}
