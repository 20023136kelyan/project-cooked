import React from 'react';
import { Recipe } from '../types/recipe';
import { Clock, Flame, Heart, Star, Play, Award } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onStartCookMode: (recipe: Recipe, e: React.MouseEvent) => void;
}

const difficultyColors = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  Advanced: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
};

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
  onStartCookMode,
}) => {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div
      onClick={() => onSelectRecipe(recipe)}
      className="group relative flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-brand-300/60 dark:hover:border-brand-700/60 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback if unsplash image fails to load
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex gap-1.5 items-center">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            {recipe.isCustom && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white flex items-center gap-1 shadow">
                <Award className="w-3 h-3" /> Custom
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => onToggleFavorite(recipe.id, e)}
            className="pointer-events-auto p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-600 dark:text-zinc-300 hover:scale-110 active:scale-95 transition-transform shadow-md"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Floating Category Tag */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white">
            {recipe.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Title & Subtitle */}
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{recipe.rating.toFixed(1)}</span>
            <span className="text-zinc-400">({recipe.reviewsCount})</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-display group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {recipe.subtitle}
          </p>
        </div>

        {/* Meta Stats: Cook time, Calories, Servings */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-brand-500" />
            <span>{recipe.nutrition.calories} kcal</span>
          </div>
          <div className="text-xs font-medium text-zinc-400">
            {recipe.ingredients.length} items
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => onStartCookMode(recipe, e)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white text-xs font-bold shadow-sm shadow-brand-500/20 active:scale-98 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Cook Mode</span>
          </button>
          <button
            type="button"
            className="py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
