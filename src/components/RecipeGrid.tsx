import React from 'react';
import { Recipe } from '../types/recipe';
import { RecipeCard } from './RecipeCard';
import { SearchX, RotateCcw } from 'lucide-react';

interface RecipeGridProps {
  recipes: Recipe[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe, e: React.MouseEvent) => void;
  onResetFilters: () => void;
  isFavoritesFilterActive: boolean;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  favorites,
  onToggleFavorite,
  onSelectRecipe,
  onStartCookMode,
  onResetFilters,
  isFavoritesFilterActive,
}) => {
  if (recipes.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-zinc-800 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white mb-2">
          {isFavoritesFilterActive ? 'No saved recipes yet' : 'No recipes match your filter'}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          {isFavoritesFilterActive 
            ? 'Click the heart icon on any recipe to save it for quick access later.'
            : 'Try adjusting your search query, difficulty, or category filter to discover more dishes.'}
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-colors shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          onToggleFavorite={onToggleFavorite}
          onSelectRecipe={onSelectRecipe}
          onStartCookMode={onStartCookMode}
        />
      ))}
    </div>
  );
};
