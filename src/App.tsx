import React, { useState, useEffect, useMemo } from 'react';
import { Recipe, Category, Difficulty } from './types/recipe';
import { INITIAL_RECIPES } from './data/mockRecipes';
import { 
  getStoredFavorites, 
  toggleStoredFavorite, 
  getStoredCustomRecipes, 
  saveStoredCustomRecipe 
} from './utils/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { RecipeGrid } from './components/RecipeGrid';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { CookModeModal } from './components/CookModeModal';
import { AddRecipeModal } from './components/AddRecipeModal';

export const App: React.FC = () => {
  // Theme state: defaults to clean bright white
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cooked_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cooked_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cooked_theme', 'light');
    }
  }, [darkMode]);

  // Recipes & Custom Recipes
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  useEffect(() => {
    setCustomRecipes(getStoredCustomRecipes());
  }, []);

  const allRecipes = useMemo(() => {
    return [...customRecipes, ...INITIAL_RECIPES];
  }, [customRecipes]);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    setFavorites(getStoredFavorites());
  }, []);

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleStoredFavorite(id);
    setFavorites(updated);
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Modals state
  const [activeDetailRecipe, setActiveDetailRecipe] = useState<Recipe | null>(null);
  const [activeCookRecipe, setActiveCookRecipe] = useState<Recipe | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Featured recipe (Chef's choice)
  const featuredRecipe = useMemo(() => {
    return allRecipes.find((r) => r.isFeatured) || allRecipes[0];
  }, [allRecipes]);

  // Filter computation
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(recipe.id)) {
        return false;
      }

      // Search query (matches title, subtitle, description, tags, and ingredient names)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(q);
        const matchesSubtitle = recipe.subtitle.toLowerCase().includes(q);
        const matchesTags = recipe.tags.some((t) => t.toLowerCase().includes(q));
        const matchesIngredients = recipe.ingredients.some((i) => i.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSubtitle && !matchesTags && !matchesIngredients) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && recipe.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && recipe.difficulty !== selectedDifficulty) {
        return false;
      }

      // Tag filter
      if (selectedTag && !recipe.tags.includes(selectedTag)) {
        return false;
      }

      // Max Cook Time
      const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
      if (maxCookTime !== null && totalTime > maxCookTime) {
        return false;
      }

      return true;
    });
  }, [allRecipes, favorites, showFavoritesOnly, searchQuery, selectedCategory, selectedDifficulty, selectedTag, maxCookTime]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedTag(null);
    setMaxCookTime(null);
    setShowFavoritesOnly(false);
  };

  const handleAddRecipe = (newRecipe: Recipe) => {
    const updated = saveStoredCustomRecipe(newRecipe);
    setCustomRecipes(updated);
    setActiveDetailRecipe(newRecipe);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        favoritesCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        {!showFavoritesOnly && (
          <Hero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            featuredRecipe={featuredRecipe}
            onSelectRecipe={setActiveDetailRecipe}
          />
        )}

        {/* Recipes Browser Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
          {showFavoritesOnly && (
            <div className="py-6 border-b border-zinc-200 dark:border-zinc-800 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-display text-zinc-900 dark:text-white">
                  Your Saved Recipes
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Showing recipes you've bookmarked for later.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFavoritesOnly(false)}
                className="text-xs font-semibold text-brand-600 hover:text-brand-500"
              >
                &larr; View all recipes
              </button>
            </div>
          )}

          {/* Category Pills & Filters */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            maxCookTime={maxCookTime}
            onSelectMaxCookTime={setMaxCookTime}
            totalResults={filteredRecipes.length}
          />

          {/* Recipe Grid */}
          <RecipeGrid
            recipes={filteredRecipes}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={setActiveDetailRecipe}
            onStartCookMode={(recipe, e) => {
              e.stopPropagation();
              setActiveCookRecipe(recipe);
            }}
            onResetFilters={handleResetFilters}
            isFavoritesFilterActive={showFavoritesOnly}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">
            Project Cooked &mdash; Crafted for culinary exploration and precision cooking.
          </p>
          <p>
            Interactive test website built with Vite, React, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <RecipeDetailModal
        recipe={activeDetailRecipe}
        isOpen={Boolean(activeDetailRecipe)}
        onClose={() => setActiveDetailRecipe(null)}
        isFavorite={activeDetailRecipe ? favorites.includes(activeDetailRecipe.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onStartCookMode={(recipe) => {
          setActiveDetailRecipe(null);
          setActiveCookRecipe(recipe);
        }}
      />

      <CookModeModal
        recipe={activeCookRecipe}
        isOpen={Boolean(activeCookRecipe)}
        onClose={() => setActiveCookRecipe(null)}
      />

      <AddRecipeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRecipe={handleAddRecipe}
      />
    </div>
  );
};
