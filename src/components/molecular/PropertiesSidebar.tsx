'use client';

import { Molecule, Atom } from '@/types/molecule';

interface PropertiesSidebarProps {
  molecule?: Molecule;
  selectedAtom: any | null;
}

export default function PropertiesSidebar({ molecule, selectedAtom }: PropertiesSidebarProps) {
  if (!molecule) return null;

  return (
    <div className="w-96 bg-slate-900/50 backdrop-blur border-l border-cyan-500/20 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Molecule Info */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-4">
         <h2 className="text-2xl font-bold text-white mb-2">{molecule.name}</h2>
          <p className="text-cyan-300 text-lg font-mono mb-4">{molecule.formula}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Molar Mass:</span>
              <span className="text-white font-medium">{molecule.molarMass} g/mol</span>
            </div>
          </div>
        </div>

        {/* Selected Atom Info */}
        {selectedAtom && (
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span>🎯</span>
              Selected Atom
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Element:</span>
                <span className="text-white font-medium">{selectedAtom.element || selectedAtom.elem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Serial:</span>
                <span className="text-white font-medium">#{selectedAtom.serial}</span>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📖</span>
            Description
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {molecule.description}
          </p>
        </div>

        {/* Bond Angles */}
        {molecule.bondAngles && molecule.bondAngles.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>📐</span>
              Bond Angles
            </h3>
            <div className="space-y-2">
              {molecule.bondAngles.map((angle, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm font-mono">
                      {angle.atom1}-{angle.vertex}-{angle.atom2}
                    </span>
                    <span className="text-cyan-400 font-bold">{angle.degrees}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uses */}
        {molecule.uses && molecule.uses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>🎯</span>
              Uses
            </h3>
            <ul className="space-y-2">
              {molecule.uses.map((use, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-cyan-400">•</span>
                  {use}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hazards */}
        {molecule.hazards && molecule.hazards.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>⚠️</span>
              Hazards
            </h3>
            <div className="space-y-2">
              {molecule.hazards.map((hazard, idx) => (
                <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{hazard}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
