import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { convertIngredientUnit, UnitSystem } from '../utils/units';
import { 
  getCheckedIngredientsMap, 
  setCheckedIngredientsMap 
} from '../utils/storage';
import { 
  X, 
  Clock, 
  Flame, 
  Users, 
  Minus, 
  Plus, 
  Check, 
  RotateCcw, 
  Play, 
  Heart, 
  Lightbulb,
  CheckCircle2,
  Share2,
  Edit3,
  Trash2,
  ShoppingCart,
  CheckCheck
} from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onStartCookMode: (recipe: Recipe) => void;
  onAddToShoppingList: (recipe: Recipe, ratio: number) => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onDeleteRecipe?: (recipeId: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onStartCookMode,
  onAddToShoppingList,
  onEditRecipe,
  onDeleteRecipe,
}) => {
  if (!isOpen || !recipe) return null;

  const [servings, setServings] = useState<number>(recipe.defaultServings);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [addedToShopping, setAddedToShopping] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    return (localStorage.getItem('cooked_unit_system') as UnitSystem) || 'us';
  });

  const handleToggleUnitSystem = (sys: UnitSystem) => {
    setUnitSystem(sys);
    localStorage.setItem('cooked_unit_system', sys);
  };

  const handleAddShoppingList = () => {
    onAddToShoppingList(recipe, ratio);
    setAddedToShopping(true);
    setTimeout(() => setAddedToShopping(false), 2000);
  };

  // Sync servings and checked state when recipe changes
  useEffect(() => {
    setServings(recipe.defaultServings);
    setCheckedMap(getCheckedIngredientsMap(recipe.id));
  }, [recipe]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleCheck = (ingredientId: string) => {
    const nextMap = {
      ...checkedMap,
      [ingredientId]: !checkedMap[ingredientId],
    };
    setCheckedMap(nextMap);
    setCheckedIngredientsMap(recipe.id, nextMap);
  };

  const resetChecks = () => {
    setCheckedMap({});
    setCheckedIngredientsMap(recipe.id, {});
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ratio = servings / recipe.defaultServings;
  const checkedCount = Object.values(checkedMap).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-zinc-900">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

          {/* Top Floating Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 text-white shadow">
                {recipe.category}
              </span>
              {recipe.isCustom && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-white shadow">
                  Custom Recipe
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {recipe.isCustom && onEditRecipe && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditRecipe(recipe);
                  }}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
                  title="Edit this custom recipe"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              {recipe.isCustom && onDeleteRecipe && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
                      onDeleteRecipe(recipe.id);
                      onClose();
                    }
                  }}
                  className="p-2.5 rounded-full bg-rose-600/80 hover:bg-rose-600 backdrop-blur-md text-white transition-colors"
                  title="Delete this custom recipe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
                title="Copy share link"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={(e) => onToggleFavorite(recipe.id, e)}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
                title="Toggle favorite"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              {recipe.title}
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-2xl">
              {recipe.subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-orange-50/50 dark:bg-zinc-800/50 border border-orange-100/80 dark:border-zinc-800">
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Prep Time</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{recipe.prepTimeMinutes} mins</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Cook Time</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{recipe.cookTimeMinutes} mins</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Total Calories</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Flame className="w-4 h-4 text-rose-500" />
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{Math.round(recipe.nutrition.calories * ratio)} kcal</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Difficulty</span>
              <span className="font-bold text-brand-600 dark:text-brand-400 mt-1">{recipe.difficulty}</span>
            </div>
          </div>

          {/* Servings Scaler & Ingredient Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>Ingredients Checklist</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400">
                    {checkedCount}/{recipe.ingredients.length} prepared
                  </span>
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Adjust portions to automatically scale quantities. Tap to check off ready items.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {/* Unit System Toggle */}
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleToggleUnitSystem('us')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      unitSystem === 'us'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    US Units
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleUnitSystem('metric')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      unitSystem === 'metric'
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    Metric (g/ml)
                  </button>
                </div>

                {/* Servings Stepper */}
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    <span>Servings:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      disabled={servings <= 1}
                      className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 disabled:opacity-30 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {servings}
                    </span>
                    <button
                      type="button"
                      onClick={() => setServings(Math.min(20, servings + 1))}
                      disabled={servings >= 20}
                      className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 disabled:opacity-30 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Grocery Add and Reset toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pb-1">
              <button
                type="button"
                onClick={handleAddShoppingList}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-brand-200/80 dark:border-zinc-700 text-brand-700 dark:text-brand-300 text-xs font-semibold transition-all shadow-sm"
              >
                {addedToShopping ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Added to Grocery List!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>Add All to Grocery List</span>
                  </>
                )}
              </button>

              {checkedCount > 0 && (
                <button
                  type="button"
                  onClick={resetChecks}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Checklist</span>
                </button>
              )}
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing) => {
                const isChecked = Boolean(checkedMap[ing.id]);
                const converted = convertIngredientUnit(ing.amount * ratio, ing.unit, unitSystem);

                return (
                  <div
                    key={ing.id}
                    onClick={() => toggleCheck(ing.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 opacity-60'
                        : 'bg-white dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-700/80 hover:border-brand-300 dark:hover:border-brand-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                        isChecked
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'border-zinc-300 dark:border-zinc-600'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 text-sm">
                      <span className={`font-semibold text-zinc-900 dark:text-zinc-100 ${isChecked ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
                        {converted.formatted}
                      </span>{' '}
                      <span className={`text-zinc-700 dark:text-zinc-300 ${isChecked ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
                        {ing.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {checkedCount > 0 && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={resetChecks}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Checklist</span>
                </button>
              </div>
            )}
          </div>

          {/* Nutritional Breakdown */}
          <div className="space-y-3">
            <h3 className="text-base font-bold font-display text-zinc-900 dark:text-white">
              Nutritional Macros (Per {servings} {servings === 1 ? 'serving' : 'servings'})
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Protein</span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {Math.round(recipe.nutrition.protein * ratio)}g
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Carbs</span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {Math.round(recipe.nutrition.carbs * ratio)}g
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Healthy Fat</span>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {Math.round(recipe.nutrition.fat * ratio)}g
                </p>
              </div>
            </div>
          </div>

          {/* Step Previews */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white">
              Step-by-Step Directions
            </h3>
            <div className="space-y-3">
              {recipe.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 flex gap-4 items-start"
                >
                  <div className="w-7 h-7 rounded-xl bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {step.instruction}
                    </p>
                    {step.timerSeconds && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                        <Clock className="w-3 h-3" />
                        Timed step: {Math.round(step.timerSeconds / 60)} mins
                      </span>
                    )}
                    {step.tip && (
                      <div className="flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-2 rounded-xl">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>Chef tip: {step.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Cook Mode Button */}
        <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
            Ready to cook? Enter the distraction-free Cook Mode with live countdown timers.
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartCookMode(recipe);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-white font-bold text-sm shadow-md shadow-brand-500/25 active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Cook Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
