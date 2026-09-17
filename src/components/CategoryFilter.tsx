import React from 'react';
import { Category, Difficulty } from '../types/recipe';
import { Sparkles, Utensils, Moon, Coffee, HeartPulse, Cake, SlidersHorizontal } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedDifficulty: Difficulty | 'All';
  onSelectDifficulty: (diff: Difficulty | 'All') => void;
  maxCookTime: number | null; // minutes or null
  onSelectMaxCookTime: (time: number | null) => void;
  totalResults: number;
}

const CATEGORIES: { label: Category; icon: React.FC<{ className?: string }> }[] = [
  { label: 'All', icon: Sparkles },
  { label: 'Quick Meals', icon: Utensils },
  { label: 'Dinner', icon: Moon },
  { label: 'Breakfast', icon: Coffee },
  { label: 'Healthy', icon: HeartPulse },
  { label: 'Baking & Desserts', icon: Cake },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  maxCookTime,
  onSelectMaxCookTime,
  totalResults,
}) => {
  return (
    <div className="py-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(({ label, icon: Icon }) => {
            const isSelected = selectedCategory === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelectCategory(label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md shadow-zinc-900/10 dark:shadow-white/10'
                    : 'bg-white dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400 dark:text-brand-600' : 'text-zinc-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls (Difficulty & Time) */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">Filter:</span>
          </div>

          {/* Difficulty selector */}
          <select
            value={selectedDifficulty}
            onChange={(e) => onSelectDifficulty(e.target.value as Difficulty | 'All')}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Time filter */}
          <select
            value={maxCookTime || ''}
            onChange={(e) => onSelectMaxCookTime(e.target.value ? Number(e.target.value) : null)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="">Any Cook Time</option>
            <option value="15">&le; 15 mins</option>
            <option value="25">&le; 25 mins</option>
            <option value="35">&le; 35 mins</option>
          </select>

          {/* Results count pill */}
          <span className="text-xs font-medium px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            {totalResults} {totalResults === 1 ? 'recipe' : 'recipes'}
          </span>
        </div>
      </div>
    </div>
  );
};
