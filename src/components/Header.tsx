import React from 'react';
import { Flame, Heart, Plus, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onOpenAddModal,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => {
          if (showFavoritesOnly) onToggleFavoritesOnly();
        }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center shadow-md shadow-brand-500/20 text-white">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
                Project Cooked
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400">
                PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Modern recipes, smart scaling & live step timers
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites Filter */}
          <button
            type="button"
            onClick={onToggleFavoritesOnly}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              showFavoritesOnly
                ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="View saved recipes"
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-semibold ${
                showFavoritesOnly 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Add Recipe button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 shadow-sm shadow-brand-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add Recipe</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
