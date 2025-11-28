'use client';

import React from 'react';
import { useLabStore } from '@/store/labStore';

export default function LabControls() {
  const mix = useLabStore(state => state.mix);
  const toggleHeat = useLabStore(state => state.toggleHeat);
  const toggleStir = useLabStore(state => state.toggleStir);
  const reset = useLabStore(state => state.reset);
  const isHeated = useLabStore(state => state.isHeated);
  const isStirred = useLabStore(state => state.isStirred);
  const chemicalsInBeaker = useLabStore(state => state.chemicalsInBeaker);

  const canMix = chemicalsInBeaker.length >= 2;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Mix button */}
      <button
        onClick={mix}
        disabled={!canMix}
        className={`
          col-span-2 py-4 px-6 rounded-xl font-bold text-lg
          transition-all duration-200 transform active:scale-95
          ${canMix
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        🧬 Mix & React
      </button>

      {/* Heat toggle */}
      <button
        onClick={toggleHeat}
        className={`
          py-3 px-4 rounded-xl font-semibold
          transition-all duration-200 transform active:scale-95
          ${isHeated
            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400'
          }
        `}
      >
        {isHeated ? '🔥 Heating' : '🔥 Heat'}
      </button>

      {/* Stir toggle */}
      <button
        onClick={toggleStir}
        className={`
          py-3 px-4 rounded-xl font-semibold
          transition-all duration-200 transform active:scale-95
          ${isStirred
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
          }
        `}
      >
        {isStirred ? '🌀 Stirring' : '🌀 Stir'}
      </button>

      {/* Reset button */}
      <button
        onClick={reset}
        className="
          col-span-2 py-2 px-4 rounded-xl font-medium
          bg-gray-100 text-gray-700 border-2 border-gray-300
          hover:bg-gray-200 hover:border-gray-400
          transition-all duration-200
        "
      >
        🔄 Reset Beaker
      </button>
    </div>
  );
}
