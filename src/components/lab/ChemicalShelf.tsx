'use client';

import React from 'react';
import { reactionEngine } from '@/engine/reactionEngine';
import ChemicalBottle from './ChemicalBottle';

export default function ChemicalShelf() {
  const chemicals = reactionEngine.getChemicals();

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 p-6 overflow-y-auto rounded-l-2xl border-r-4 border-indigo-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="text-3xl mr-2">🧪</span>
        Chemical Shelf
      </h2>
      
      <p className="text-sm text-gray-600 mb-6">
        Drag chemicals into the beaker to create reactions
      </p>

      {/* Chemical grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {chemicals.map(chemical => (
          <ChemicalBottle key={chemical.id} chemical={chemical} />
        ))}
      </div>

      {/* Tips section */}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
        <h3 className="font-semibold text-sm text-indigo-900 mb-2">💡 Tips</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Mix acids with bases for neutralization</li>
          <li>• Some reactions need heating</li>
          <li>• Watch for color changes and bubbles</li>
          <li>• Be careful with dangerous combos!</li>
        </ul>
      </div>
    </div>
  );
}
