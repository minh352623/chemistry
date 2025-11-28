'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Compound } from '@/data/compounds';
import DropZone from './DropZone';
import CompoundToolbox from './CompoundToolbox';
import DraggableCompound from './DraggableCompound';
import ReactionEffects from '../effects/ReactionEffects';

export default function ReactionBuilder() {
  const t = useTranslations('builder');
  const locale = useLocale();
  const [reactants, setReactants] = useState<Compound[]>([]);
  const [products, setProducts] = useState<Compound[]>([]);
  const [activeCompound, setActiveCompound] = useState<Compound | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCompound(event.active.data.current as Compound);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCompound(null);

    if (!over) return;

    const compound = active.data.current as Compound;

    if (over.id === 'reactants') {
      setReactants([...reactants, compound]);
    } else if (over.id === 'products') {
      setProducts([...products, compound]);
    }
  };

  const analyzeReaction = async () => {
    if (reactants.length === 0 || products.length === 0) {
      alert(t('addBothSides'));
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call API endpoint
      const response = await fetch('/api/reaction/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reactants: reactants.map(c => c.formula),
          products: products.map(c => c.formula),
          locale: locale
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze reaction');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert(t('analysisFailed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setReactants([]);
    setProducts([]);
    setResult(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ⚗️ {t('title')}
            </h1>
            <p className="text-slate-300">{t('subtitle')}</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Workspace - Spans 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reaction Workspace */}
              <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-6">
                  <DropZone
                    id="reactants"
                    label={t('reactants')}
                    compounds={reactants}
                    onRemove={(index) => setReactants(reactants.filter((_, i) => i !== index))}
                    color="text-cyan-400"
                  />

                  <div className="flex flex-col items-center justify-center px-4">
                    <div className="text-4xl text-purple-400">→</div>
                    <div className="text-xs text-slate-400 mt-1">Δ</div>
                  </div>

                  <DropZone
                    id="products"
                    label={t('products')}
                    compounds={products}
                    onRemove={(index) => setProducts(products.filter((_, i) => i !== index))}
                    color="text-purple-400"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={analyzeReaction}
                    disabled={isAnalyzing}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    {isAnalyzing ? `⏳ ${t('analyzing')}` : `⚡ ${t('analyzeReaction')}`}
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    {t('clear')}
                  </button>
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className="space-y-4">
                  {/* Balanced Equation */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6">
                    <h3 className="text-emerald-400 font-semibold mb-3">✅ {t('balancedEquation')}</h3>
                    <p className="text-2xl text-white font-mono break-words">
                      {result.balanced}
                    </p>
                    <div className="mt-3 flex gap-4 text-sm text-slate-300">
                      <span>{t('balanced')}: {result.isBalanced ? '✓' : '✗'}</span>
                      <span>{t('coefficients')}: [{result.coefficients.join(', ')}]</span>
                    </div>
                  </div>

                  {/* AI Explanation */}
                  {result.explanation && (
                    <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6">
                      <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                        <span>💡</span>
                        {t('aiExplanation')}
                      </h3>
                      <div className="text-slate-200 leading-relaxed whitespace-pre-line mb-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {result.explanation}
                      </div>
                      
                      {/* Try Experiment Button */}
                      <button
                        onClick={() => setShowEffects(true)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <span>🧪</span>
                        {t('tryExperiment')}
                      </button>
                    </div>
                  )}

                  {/* Analysis */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                    <h3 className="text-purple-400 font-semibold mb-3">🔬 {t('reactionAnalysis')}</h3>
                    
                    <div className="space-y-3">
                      {result.types && result.types.length > 0 && (
                        <div>
                          <p className="text-slate-300 mb-2">{t('types')}:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.types.map((type: string) => (
                              <span
                                key={type}
                                className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-300 text-sm"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {result.precipitate && (
                        <div className="bg-slate-700/50 rounded p-3">
                          <p className="text-white font-mono">{result.precipitate.compound}</p>
                          <p className="text-sm text-slate-400">{result.precipitate.description}</p>
                        </div>
                      )}

                      {result.gas && (
                        <div className="bg-slate-700/50 rounded p-3">
                          <p className="text-white font-mono">{result.gas.compound}</p>
                          <p className="text-sm text-slate-400">{result.gas.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Toolbox - 1 column */}
            <div>
              <CompoundToolbox />
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeCompound && <DraggableCompound compound={activeCompound} />}
      </DragOverlay>

      {/* Reaction Effects */}
      {result && (
        <ReactionEffects
          types={result.types || []}
          precipitate={result.precipitate}
          gas={result.gas}
          show={showEffects}
          onComplete={() => setShowEffects(false)}
        />
      )}
    </DndContext>
  );
}
