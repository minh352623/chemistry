'use client';

import { useDraggable } from '@dnd-kit/core';
import { Compound } from '@/data/compounds';

interface DraggableCompoundProps {
  compound: Compound;
}

export default function DraggableCompound({ compound }: DraggableCompoundProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: compound.id,
    data: compound
  });

  const styleWithColors = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    backgroundColor: compound.color + '20',
    borderColor: compound.color
  };

  return (
    <div
      ref={setNodeRef}
      style={styleWithColors}
      {...listeners}
      {...attributes}
      className={`
        relative group
        px-4 py-3 rounded-lg
        border-2 border-opacity-50
        transition-all duration-200
        hover:scale-105 hover:shadow-lg
        active:scale-95
      `}
    >
      <div className="flex flex-col gap-1">
        <span className="text-lg font-bold text-white font-mono">
          {compound.formula}
        </span>
        <span className="text-xs text-slate-300 truncate">
          {compound.name}
        </span>
      </div>
      
      {/* Drag indicator */}
      <div className="absolute top-1 right-1 text-white/50 text-xs">
        ⋮⋮
      </div>
    </div>
  );
}
