'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useLabStore } from '@/store/labStore';
import Scene3D from '../3d/Scene3D';
import { Chemical } from '@/types/chemistry';

export default function Beaker() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'beaker'
  });

  const chemicalsInBeaker = useLabStore(state => state.chemicalsInBeaker);
  const removeChemical = useLabStore(state => state.removeChemical);

  return (
    <div className="flex flex-col h-full">
      {/* Beaker container */}
      <div
        ref={setNodeRef}
        className={`
          relative flex-1 rounded-2xl overflow-hidden
          transition-all duration-300
          ${isOver ? 'ring-4 ring-green-400 ring-opacity-50 scale-105' : 'ring-2 ring-gray-300'}
        `}
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          minHeight: '400px'
        }}
      >
        <Scene3D />
        
        {/* Drop hint */}
        {chemicalsInBeaker.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-white bg-opacity-80 p-6 rounded-xl">
              <p className="text-2xl mb-2">⚗️</p>
              <p className="text-gray-600 font-medium">Drop chemicals here</p>
              <p className="text-sm text-gray-500 mt-1">Start your experiment!</p>
            </div>
          </div>
        )}
      </div>

      {/* Current chemicals list */}
      {chemicalsInBeaker.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-xl shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">In Beaker:</h3>
          <div className="flex flex-wrap gap-2">
            {chemicalsInBeaker.map(({ chemical, amount }) => (
              <div
                key={chemical.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full text-sm group hover:bg-indigo-100 transition-colors"
              >
                <span className="font-mono text-indigo-700">{chemical.formula}</span>
                {amount > 1 && (
                  <span className="text-xs bg-indigo-200 px-1.5 rounded-full">×{amount}</span>
                )}
                <button
                  onClick={() => removeChemical(chemical.id)}
                  className="ml-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
