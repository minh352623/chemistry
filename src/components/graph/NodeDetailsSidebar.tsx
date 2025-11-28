'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import MoleculeViewer3D from './MoleculeViewer3D';

interface NodeDetailsSidebarProps {
  selectedNode: any;
  onClose: () => void;
}

export default function NodeDetailsSidebar({ selectedNode, onClose }: NodeDetailsSidebarProps) {
  const t = useTranslations('knowledgeGraph');
  const tChem = useTranslations('chemistry');

  if (!selectedNode) return null;

  const isChemical = selectedNode.type === 'chemical';
  const isReaction = selectedNode.type === 'reaction';

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-white/95 backdrop-blur shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out overflow-y-auto z-20">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white/95 backdrop-blur z-10">
        <div>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
            isChemical ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {isChemical ? t('chemical') : t('reactionNode')}
          </span>
          <h2 className="text-2xl font-bold text-slate-800">{selectedNode.label}</h2>
          {isChemical && (
            <p className="text-slate-500 font-mono mt-1">{selectedNode.formula}</p>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        
        {/* 3D Viewer for Chemicals */}
        {isChemical && selectedNode.formula && (
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <MoleculeViewer3D formula={selectedNode.formula} />
          </div>
        )}

        {/* Properties Section */}
        {isChemical && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {tChem('properties')}
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">{tChem('state')}</span>
                <span className="font-medium text-slate-800 capitalize">{selectedNode.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">pH</span>
                <span className="font-medium text-slate-800">{selectedNode.ph}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{tChem('molarMass')}</span>
                <span className="font-medium text-slate-800">{selectedNode.mass} g/mol</span>
              </div>
            </div>
          </div>
        )}

        {/* Reaction Details */}
        {isReaction && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {t('equation')}
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-700 break-words">
              {/* Simple equation representation */}
              {selectedNode.reactants?.join(' + ')} → {selectedNode.products?.join(' + ')}
            </div>
          </div>
        )}

        {/* Description/Explanation */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {isReaction ? t('explanation') : tChem('description')}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {selectedNode.description || "No description available."}
          </p>
        </div>

        {/* Safety/Hazard */}
        {isChemical && (
          <div>
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {tChem('hazard')}
            </h3>
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              selectedNode.hazard === 'High' ? 'bg-red-50 text-red-700' : 
              selectedNode.hazard === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 
              'bg-green-50 text-green-700'
            }`}>
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium">
                  {selectedNode.hazard === 'High' ? 'High Hazard' : 
                   selectedNode.hazard === 'Medium' ? 'Moderate Hazard' : 'Low Hazard'}
                </p>
                <p className="text-sm opacity-90 mt-1">
                  Handle with appropriate safety gear.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100">
          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2">
            <span>🧪</span>
            {isChemical ? t('viewReactions') : t('simulateReaction')}
          </button>
        </div>

      </div>
    </div>
  );
}
