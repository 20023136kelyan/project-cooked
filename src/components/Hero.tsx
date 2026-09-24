import React from 'react';
import { Search, X, Sparkles, Clock, Utensils } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  featuredRecipe?: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
}

const POPULAR_TAGS = [
  'Quick & Easy',
  'High Protein',
  'Vegetarian',
  'Gluten-Free',
  'Keto-Friendly',
  'Comfort Food',
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  featuredRecipe,
  onSelectRecipe,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Title & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/40 text-brand-700 dark:text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Kitchen Companion & Test Site
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-display leading-[1.1]">
                Cook better dishes with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-amber-500 to-orange-500">zero guesswork</span>.
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl">
                Explore curated culinary creations. Scale ingredient portions with a single tap and step through preparation with our hands-free cooking timers.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-zinc-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, or cuisines (e.g. salmon, noodles, garlic)..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm sm:text-base transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Tag Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1">
                Trending:
              </span>
              {POPULAR_TAGS.map((tag) => {
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onSelectTag(isActive ? null : tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Spotlight Card */}
          {featuredRecipe && (
            <div className="lg:col-span-5">
              <div 
                onClick={() => onSelectRecipe(featuredRecipe)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-orange-100 dark:border-zinc-800 shadow-xl shadow-orange-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/10"
              >
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img
                    src={featuredRecipe.imageUrl}
                    alt={featuredRecipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 text-white shadow">
                      Chef's Choice
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white">
                      {featuredRecipe.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-display leading-snug group-hover:text-amber-200 transition-colors">
                      {featuredRecipe.title}
                    </h3>
                    <p className="text-xs text-zinc-200 line-clamp-1 mt-1">
                      {featuredRecipe.subtitle}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-300">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{featuredRecipe.prepTimeMinutes + featuredRecipe.cookTimeMinutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" />
                        <span>{featuredRecipe.ingredients.length} ingredients</span>
                      </div>
                      <div className="ml-auto font-semibold text-brand-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Cook Now &rarr;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
