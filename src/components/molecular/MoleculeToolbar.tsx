'use client';

import { ViewMode } from '@/types/molecule';

interface MoleculeToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showAngles: boolean;
  onToggleAngles: () => void;
  showHybridization: boolean;
  onToggleHybridization: () => void;
}

export default function MoleculeToolbar({
  viewMode,
  onViewModeChange,
  showAngles,
  onToggleAngles,
  showHybridization,
  onToggleHybridization
}: MoleculeToolbarProps) {
  const viewModes: { mode: ViewMode; label: string; icon: string }[] = [
    { mode: 'ball-stick', label: 'Ball & Stick', icon: '⚛️' },
    { mode: 'space-filling', label: 'Space Filling', icon: '🔮' },
    { mode: 'wireframe', label: 'Wireframe', icon: '📐' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-slate-900/50 backdrop-blur border border-cyan-500/20 rounded-lg">
      {/* View Mode Buttons */}
      <div className="flex gap-2 pr-4 border-r border-slate-700">
        {viewModes.map(({ mode, label, icon }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              viewMode === mode
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600'
            }`}
          >
            <span className="mr-2">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Feature Toggles */}
      <div className="flex gap-2">
        <button
          onClick={onToggleAngles}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            showAngles
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600'
          }`}
        >
          <span className="mr-2">📐</span>
          Bond Angles
        </button>

        <button
          onClick={onToggleHybridization}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            showHybridization
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600'
          }`}
        >
          <span className="mr-2">🌀</span>
          Hybridization
        </button>
      </div>
    </div>
  );
}
