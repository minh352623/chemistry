'use client';

import { useDroppable } from '@dnd-kit/core';
import { Compound } from '@/data/compounds';

interface DropZoneProps {
  id: string;
  label: string;
  compounds: Compound[];
  onRemove: (index: number) => void;
  color: string;
}

export default function DropZone({ id, label, compounds, onRemove, color }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id
  });

  return (
    <div className="flex-1">
      <h3 className={`text-lg font-semibold mb-3 ${color}`}>
        {label}
      </h3>
      
      <div
        ref={setNodeRef}
        className={`
          min-h-[200px] p-4 rounded-xl border-2 border-dashed
          transition-all duration-200
          ${isOver ? 'bg-white/10 border-white/50 scale-[1.02]' : 'bg-white/5 border-white/20'}
        `}
      >
        {compounds.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Drop compounds here
          </div>
        ) : (
          <div className="space-y-2">
            {compounds.map((compound, index) => (
              <div
                key={`${compound.id}-${index}`}
                className="group relative flex items-center gap-3 p-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
                style={{
                  borderLeftColor: compound.color,
                  borderLeftWidth: '4px'
                }}
              >
                <div className="flex-1">
                  <span className="font-mono font-bold text-white">
                    {compound.formula}
                  </span>
                  <span className="ml-2 text-sm text-slate-300">
                    {compound.name}
                  </span>
                </div>
                
                <button
                  onClick={() => onRemove(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                >
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
