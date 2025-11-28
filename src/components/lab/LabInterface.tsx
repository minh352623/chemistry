'use client';

import React from 'react';
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { useLabStore } from '@/store/labStore';
import { Chemical } from '@/types/chemistry';
import ChemicalShelf from './ChemicalShelf';
import Beaker from './Beaker';
import LabControls from './LabControls';
import ReactionPanel from './ReactionPanel';
import ChemicalBottle from './ChemicalBottle';

export default function LabInterface() {
  const addChemical = useLabStore(state => state.addChemical);
  const [activeDragItem, setActiveDragItem] = React.useState<Chemical | null>(null);

  const handleDragStart = (event: any) => {
    setActiveDragItem(event.active.data.current as Chemical);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === 'beaker') {
      const chemical = active.data.current as Chemical;
      addChemical(chemical);
    }

    setActiveDragItem(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
        {/* Left Sidebar - Chemical Shelf */}
        <div className="w-96 flex-shrink-0 overflow-hidden">
          <ChemicalShelf />
        </div>

        {/* Main Lab Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                ⚗️ Chemistry Reaction Simulator
              </h1>
              <p className="text-gray-600">
                Drag chemicals into the beaker and watch the magic happen!
              </p>
            </div>

            {/* Lab workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Beaker + Controls (2/3 width) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="h-[500px]">
                  <Beaker />
                </div>
                <LabControls />
              </div>

              {/* Reaction Panel (1/3 width) */}
              <div className="lg:col-span-1">
                <ReactionPanel />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragItem && (
          <div className="opacity-70 scale-110">
            <ChemicalBottle chemical={activeDragItem} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
