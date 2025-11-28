'use client';

import React from 'react';
import { Chemical } from '@/types/chemistry';
import { useDraggable } from '@dnd-kit/core';
import { getHazardColor } from '@/utils/chemistryHelpers';

interface ChemicalBottleProps {
  chemical: Chemical;
}

export default function ChemicalBottle({ chemical }: ChemicalBottleProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: chemical.id,
    data: chemical
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.6 : 1
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative group cursor-grab active:cursor-grabbing
        bg-white rounded-xl p-4 shadow-md hover:shadow-xl
        transition-all duration-200 border-2 border-gray-200
        hover:border-indigo-300 hover:scale-105
        ${isDragging ? 'cursor-grabbing' : ''}
      `}
    >
      {/* Hazard indicator */}
      <div
        className="absolute top-2 right-2 w-3 h-3 rounded-full ring-2 ring-white"
        style={{ backgroundColor: getHazardColor(chemical.hazard) }}
        title={`Hazard: ${chemical.hazard}`}
      />

      {/* Bottle SVG */}
      <div className="flex justify-center mb-2">
        <svg width="60" height="80" viewBox="0 0 60 80" className="drop-shadow-sm">
          {/* Bottle body */}
          <rect
            x="15"
            y="20"
            width="30"
            height="50"
            rx="4"
            fill={chemical.color}
            stroke="#333"
            strokeWidth="2"
            opacity="0.8"
          />
          {/* Bottle neck */}
          <rect
            x="20"
            y="10"
            width="20"
            height="12"
            rx="2"
            fill={chemical.color}
            stroke="#333"
            strokeWidth="2"
            opacity="0.9"
          />
          {/* Cap */}
          <rect
            x="18"
            y="5"
            width="24"
            height="7"
            rx="2"
            fill="#666"
            stroke="#333"
            strokeWidth="1"
          />
          {/* Highlight */}
          <rect
            x="18"
            y="25"
            width="8"
            height="30"
            rx="2"
            fill="white"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Chemical name */}
      <div className="text-center">
        <p className="font-bold text-sm text-gray-800 mb-0.5">{chemical.name}</p>
        <p className="text-xs text-gray-600 font-mono">{chemical.formula}</p>
        <p className="text-xs text-gray-500 mt-1 italic truncate" title={chemical.description}>
          {chemical.description}
        </p>
      </div>

      {/* Drag hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
          Drag to beaker
        </div>
      </div>
    </div>
  );
}
