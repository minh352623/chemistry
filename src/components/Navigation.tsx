'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('navigation');

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">⚗️</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ChemLab</span>
          </Link>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              {t('home')}
            </Link>
            <Link href="/lab" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              {t('lab')}
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              {t('history')}
            </Link>
            <Link href="/knowledge" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1">
              <span>🧠</span> {t('knowledge')}
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              {t('about')}
            </Link>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
