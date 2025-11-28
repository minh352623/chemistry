'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import NodeDetailsSidebar from '@/components/graph/NodeDetailsSidebar';

import ErrorBoundary from '@/components/ErrorBoundary';

// Dynamically import GraphCanvas with SSR disabled to avoid hydration issues
const GraphCanvas = dynamic(() => import('@/components/graph/GraphCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500">Loading knowledge graph...</div>
    </div>
  )
});

export default function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const t = useTranslations('knowledgeGraph');

  const handleNodeClick = (nodeData: any) => {
    setSelectedNode(nodeData);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <main className="relative overflow-hidden h-screen">
          {/* Graph Area */}
          <div className="absolute inset-0 z-0">
            <GraphCanvas onNodeClick={handleNodeClick} />
          </div>

          {/* Overlay Controls */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-sm border border-slate-200 max-w-xs">
              <h1 className="text-xl font-bold text-slate-800 mb-1">{t('title')}</h1>
              <p className="text-sm text-slate-500">
                {t('subtitle')}
              </p>
              
              {/* Search (Placeholder) */}
              <div className="mt-4 relative">
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <NodeDetailsSidebar 
            selectedNode={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}
