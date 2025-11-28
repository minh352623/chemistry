'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { compounds } from '@/data/compounds';
import DraggableCompound from './DraggableCompound';

export default function CompoundToolbox() {
  const t = useTranslations('builder');
  const tChem = useTranslations('chemistry');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = compounds.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                         c.formula.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.type === filter;
    return matchesSearch && matchesFilter;
  });

  const types = ['all', 'acid', 'base', 'salt', 'metal', 'gas'];

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📦</span>
        {t('compoundToolbox')}
      </h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`🔍 ${t('searchPlaceholder')}`}
          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === type
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {type === 'all' ? t('allTypes') : tChem(type as any)}
          </button>
        ))}
      </div>

      {/* Compounds Grid */}
      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map(compound => (
          <DraggableCompound key={compound.id} compound={compound} />
        ))}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.7);
        }
      `}</style>
    </div>
  );
}
