'use client';

import { useState } from 'react';
import { ViewMode } from '@/types/molecule';
import ViewerCanvas from './ViewerCanvas';
import MoleculeToolbar from './MoleculeToolbar';
import PropertiesSidebar from './PropertiesSidebar';
import { molecules } from '@/data/molecules';

interface MoleculeViewerProps {
  initialMoleculeId?: string;
}

export default function MoleculeViewer({ initialMoleculeId = 'h2o' }: MoleculeViewerProps) {
  const [moleculeId, setMoleculeId] = useState(initialMoleculeId);
  const [viewMode, setViewMode] = useState<ViewMode>('ball-stick');
  const [selectedAtom, setSelectedAtom] = useState<any | null>(null);
  const [showAngles, setShowAngles] = useState(false);
  const [showHybridization, setShowHybridization] = useState(false);

  const currentMolecule = molecules.find(m => m.id === moleculeId);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur border-b border-cyan-500/20">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🔬 3D Molecular Viewer
          </h1>
          
          {/* Molecule Selector */}
          <select
            value={moleculeId}
            onChange={(e) => setMoleculeId(e.target.value)}
            className="px-4 py-2 bg-slate-800/80 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {molecules.map(mol => (
              <option key={mol.id} value={mol.id}>
                {mol.name} ({mol.formula})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-cyan-500/30 rounded-lg text-cyan-300 transition-colors">
            Help
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Viewer Section */}
        <div className="flex-1 flex flex-col p-6">
          <div className="flex-1">
            <ViewerCanvas
              moleculeId={moleculeId}
              viewMode={viewMode}
              onAtomClick={setSelectedAtom}
              showAngles={showAngles}
              showHybridization={showHybridization}
            />
          </div>

          {/* Toolbar */}
          <div className="mt-4">
            <MoleculeToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showAngles={showAngles}
              onToggleAngles={() => setShowAngles(!showAngles)}
              showHybridization={showHybridization}
              onToggleHybridization={() => setShowHybridization(!showHybridization)}
            />
          </div>
        </div>

        {/* Properties Sidebar */}
        <PropertiesSidebar
          molecule={currentMolecule}
          selectedAtom={selectedAtom}
        />
      </div>
    </div>
  );
}
