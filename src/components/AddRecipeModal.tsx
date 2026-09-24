import React, { useState, useEffect } from 'react';
import { Recipe, Category, Difficulty, Ingredient, CookingStep } from '../types/recipe';
import { X, Plus, Trash2, Sparkles, Image as ImageIcon, Edit3 } from 'lucide-react';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe: (recipe: Recipe) => void;
  editingRecipe?: Recipe | null;
}

const PRESET_IMAGES = [
  { label: 'Pasta', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Steak', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Salad', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pancake', url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80' },
];

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  isOpen,
  onClose,
  onSaveRecipe,
  editingRecipe,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Category>('Dinner');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [prepTime, setPrepTime] = useState<number>(10);
  const [cookTime, setCookTime] = useState<number>(20);
  const [servings, setServings] = useState<number>(2);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [calories, setCalories] = useState<number>(450);

  const [ingredients, setIngredients] = useState<{ name: string; amount: number; unit: string }[]>([
    { name: 'Olive oil', amount: 1, unit: 'tbsp' },
    { name: 'Garlic cloves', amount: 2, unit: 'cloves' },
  ]);

  const [steps, setSteps] = useState<{ instruction: string; timerMinutes?: number }[]>([
    { instruction: 'Heat oil in pan over medium heat and sauté garlic.' },
    { instruction: 'Cook main ingredients until golden and season to taste.', timerMinutes: 5 },
  ]);

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title);
      setSubtitle(editingRecipe.subtitle);
      setCategory(editingRecipe.category);
      setDifficulty(editingRecipe.difficulty);
      setPrepTime(editingRecipe.prepTimeMinutes);
      setCookTime(editingRecipe.cookTimeMinutes);
      setServings(editingRecipe.defaultServings);
      setImageUrl(editingRecipe.imageUrl);
      setCalories(editingRecipe.nutrition.calories);
      setIngredients(
        editingRecipe.ingredients.map((ing) => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
        }))
      );
      setSteps(
        editingRecipe.steps.map((st) => ({
          instruction: st.instruction,
          timerMinutes: st.timerSeconds ? Math.round(st.timerSeconds / 60) : undefined,
        }))
      );
    } else {
      setTitle('');
      setSubtitle('');
      setCategory('Dinner');
      setDifficulty('Easy');
      setPrepTime(10);
      setCookTime(20);
      setServings(2);
      setImageUrl(PRESET_IMAGES[0].url);
      setCalories(450);
      setIngredients([
        { name: 'Olive oil', amount: 1, unit: 'tbsp' },
        { name: 'Garlic cloves', amount: 2, unit: 'cloves' },
      ]);
      setSteps([
        { instruction: 'Heat oil in pan over medium heat and sauté garlic.' },
        { instruction: 'Cook main ingredients until golden and season to taste.', timerMinutes: 5 },
      ]);
    }
  }, [editingRecipe, isOpen]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: 'cup' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, { instruction: '' }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedIngredients: Ingredient[] = ingredients
      .filter((i) => i.name.trim().length > 0)
      .map((ing, idx) => ({
        id: `custom-ing-${Date.now()}-${idx}`,
        name: ing.name.trim(),
        amount: Number(ing.amount) || 1,
        unit: ing.unit.trim(),
      }));

    const formattedSteps: CookingStep[] = steps
      .filter((s) => s.instruction.trim().length > 0)
      .map((step, idx) => ({
        stepNumber: idx + 1,
        instruction: step.instruction.trim(),
        timerSeconds: step.timerMinutes ? step.timerMinutes * 60 : undefined,
      }));

    const savedRecipe: Recipe = {
      id: editingRecipe ? editingRecipe.id : `recipe-custom-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Delicious custom test recipe',
      description: subtitle.trim() || 'A homemade custom creation on Project Cooked.',
      imageUrl: imageUrl || PRESET_IMAGES[0].url,
      category,
      difficulty,
      prepTimeMinutes: Number(prepTime) || 10,
      cookTimeMinutes: Number(cookTime) || 15,
      defaultServings: Number(servings) || 2,
      tags: editingRecipe ? editingRecipe.tags : ['Custom Recipe', category],
      rating: editingRecipe ? editingRecipe.rating : 5.0,
      reviewsCount: editingRecipe ? editingRecipe.reviewsCount : 1,
      isCustom: true,
      nutrition: {
        calories: Number(calories) || 400,
        protein: Math.round((Number(calories) || 400) * 0.05),
        carbs: Math.round((Number(calories) || 400) * 0.1),
        fat: Math.round((Number(calories) || 400) * 0.04),
      },
      ingredients: formattedIngredients.length > 0 ? formattedIngredients : [
        { id: '1', name: 'Main ingredient', amount: 1, unit: 'portion' }
      ],
      steps: formattedSteps.length > 0 ? formattedSteps : [
        { stepNumber: 1, instruction: 'Prepare ingredients and cook with care.' }
      ],
    };

    onSaveRecipe(savedRecipe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              {editingRecipe ? <Edit3 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <h2 className="text-lg font-bold font-display text-zinc-900 dark:text-white">
              {editingRecipe ? 'Edit Recipe' : 'Create New Test Recipe'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Subtitle */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Recipe Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Grandma's Secret Garlic Bread"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Catchy Subtitle / Description
              </label>
              <input
                type="text"
                placeholder="e.g. Golden, crusty sourdough infused with roasted garlic butter and parsley"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Category, Difficulty, Calories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
              >
                <option value="Dinner">Dinner</option>
                <option value="Quick Meals">Quick Meals</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Healthy">Healthy</option>
                <option value="Baking & Desserts">Baking & Desserts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                min="50"
                max="2500"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
              />
            </div>
          </div>

          {/* Prep, Cook Time, Servings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Prep (mins)
              </label>
              <input
                type="number"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Cook (mins)
              </label>
              <input
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                Servings
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm"
              />
            </div>
          </div>

          {/* Image Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Choose Cover Photo (or enter custom URL)</span>
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setImageUrl(img.url)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                    imageUrl === img.url
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
            />
          </div>

          {/* Ingredients list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Ingredients ({ingredients.length})
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ingredient
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Amt"
                    value={ing.amount}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].amount = Number(e.target.value);
                      setIngredients(updated);
                    }}
                    className="w-16 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g. tbsp, g)"
                    value={ing.unit}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].unit = e.target.value;
                      setIngredients(updated);
                    }}
                    className="w-24 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Ingredient name (e.g. Fresh Rosemary)"
                    value={ing.name}
                    onChange={(e) => {
                      const updated = [...ingredients];
                      updated[idx].name = e.target.value;
                      setIngredients(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-1 text-zinc-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Cooking Steps ({steps.length})
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    placeholder={`Step ${idx + 1} instructions...`}
                    value={step.instruction}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].instruction = e.target.value;
                      setSteps(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Mins (opt)"
                    value={step.timerMinutes || ''}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].timerMinutes = e.target.value ? Number(e.target.value) : undefined;
                      setSteps(updated);
                    }}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                    title="Optional timer in minutes"
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 text-zinc-400 hover:text-rose-500 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/20 active:scale-98 transition-all"
            >
              {editingRecipe ? 'Save Changes' : 'Save & View Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
