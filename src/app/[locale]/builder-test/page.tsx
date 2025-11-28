'use client';

import { useState } from 'react';
import { FormulaParser } from '@/utils/formulaParser';
import { EquationBalancer } from '@/utils/equationBalancer';
import { ReactionAnalyzer } from '@/utils/reactionAnalyzer';
import { compounds } from '@/data/compounds';

export default function ReactionBuilderTest() {
  const [reactantFormulas, setReactantFormulas] = useState<string[]>(['Fe', 'CuSO₄']);
  const [productFormulas, setProductFormulas] = useState<string[]>(['FeSO₄', 'Cu']);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeReaction = () => {
    try {
      setError(null);
      
      // Parse formulas
      const reactants = reactantFormulas.map(f => FormulaParser.parse(f));
      const products = productFormulas.map(f => FormulaParser.parse(f));
      
      // Balance equation
      const balanced = EquationBalancer.balance({ reactants, products });
      
      // Analyze reaction
      const analysis = ReactionAnalyzer.analyze({ reactants, products });
      
      setResult({
        balanced,
        analysis
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze reaction');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🧪 Reaction Builder Test
        </h1>

        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Reactants */}
            <div>
              <h3 className="text-cyan-400 font-semibold mb-3">Reactants</h3>
              {reactantFormulas.map((formula, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={formula}
                  onChange={(e) => {
                    const newReactants = [...reactantFormulas];
                    newReactants[idx] = e.target.value;
                    setReactantFormulas(newReactants);
                  }}
                  className="w-full mb-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                />
              ))}
              <button
                onClick={() => setReactantFormulas([...reactantFormulas, ''])}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                + Add Reactant
              </button>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-purple-400 font-semibold mb-3">Products</h3>
              {productFormulas.map((formula, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={formula}
                  onChange={(e) => {
                    const newProducts = [...productFormulas];
                    newProducts[idx] = e.target.value;
                    setProductFormulas(newProducts);
                  }}
                  className="w-full mb-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                />
              ))}
              <button
                onClick={() => setProductFormulas([...productFormulas, ''])}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                + Add Product
              </button>
            </div>
          </div>

          <button
            onClick={analyzeReaction}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            ⚡ Analyze Reaction
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">❌ {error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Balanced Equation */}
            <div className="bg-slate-800/50 backdrop-blur border border-emerald-500/30 rounded-lg p-6">
              <h3 className="text-emerald-400 font-semibold mb-3">✅ Balanced Equation</h3>
              <p className="text-2xl text-white font-mono">{result.balanced.balanced}</p>
              <div className="mt-3 text-sm text-slate-400">
                Is Balanced: {result.balanced.isBalanced ? '✓ Yes' : '✗ No'}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                Coefficients: [{result.balanced.coefficients.join(', ')}]
              </div>
            </div>

            {/* Reaction Analysis */}
            <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-purple-400 font-semibold mb-3">🔬 Reaction Analysis</h3>
              
              {/* Types */}
              <div className="mb-4">
                <p className="text-slate-300 mb-2">Reaction Types:</p>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.types.map((type: string) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-purple-300 text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Precipitate */}
              {result.analysis.precipitate && (
                <div className="mb-4">
                  <p className="text-slate-300 mb-2">💧 Precipitate:</p>
                  <div className="bg-slate-700/50 rounded p-3">
                    <p className="text-white">{result.analysis.precipitate.compound}</p>
                    <p className="text-sm text-slate-400">{result.analysis.precipitate.description}</p>
                  </div>
                </div>
              )}

              {/* Gas */}
              {result.analysis.gas && (
                <div>
                  <p className="text-slate-300 mb-2">🌫️ Gas Evolved:</p>
                  <div className="bg-slate-700/50 rounded p-3">
                    <p className="text-white">{result.analysis.gas.compound}</p>
                    <p className="text-sm text-slate-400">{result.analysis.gas.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Compound Reference */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-600/30 rounded-lg p-6">
              <h3 className="text-slate-300 font-semibold mb-3">📚 Available Compounds</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {compounds.slice(0, 12).map(c => (
                  <div key={c.id} className="text-slate-400">
                    <span className="font-mono text-white">{c.formula}</span> - {c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
