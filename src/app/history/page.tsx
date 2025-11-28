'use client';

import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory, ExperimentHistory } from '@/utils/localStorage';
import { formatTimestamp } from '@/utils/chemistryHelpers';

export default function HistoryPage() {
  const [history, setHistory] = useState<ExperimentHistory[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all experiment history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📜 Experiment History
          </h1>
          <p className="text-gray-600">
            View all your past chemistry experiments
          </p>
        </div>

        {/* Clear Button */}
        {history.length > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear All History
            </button>
          </div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🧪</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Experiments Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start mixing chemicals in the lab to build your experiment history!
            </p>
            <a
              href="/lab"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Lab
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((experiment) => (
              <div
                key={experiment.id}
                className={`
                  bg-white rounded-xl shadow-md p-6 border-l-4 transition-all hover:shadow-lg
                  ${experiment.result.success ? 'border-green-500' : 'border-gray-400'}
                `}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-sm font-semibold
                      ${experiment.result.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'}
                    `}>
                      {experiment.result.success ? '✓ Success' : '✗ No Reaction'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(experiment.timestamp)}
                  </span>
                </div>

                {/* Reactants */}
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2 font-semibold">Chemicals Mixed:</p>
                  <div className="flex flex-wrap gap-2">
                    {experiment.reactants.map((reactant: { name: string; formula: string }, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-mono"
                      >
                        {reactant.formula}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reaction Details */}
                {experiment.reaction ? (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {experiment.reaction.equation}
                    </p>
                    <p className="text-sm text-gray-600">
                      {experiment.reaction.type}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    {experiment.result.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
