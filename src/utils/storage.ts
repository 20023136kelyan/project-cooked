import { Recipe, Ingredient, ShoppingItem, IngredientAisle } from '../types/recipe';

const FAVORITES_KEY = 'cooked_favorites_v1';
const CUSTOM_RECIPES_KEY = 'cooked_custom_recipes_v1';
const CHECKED_INGREDIENTS_KEY = 'cooked_checked_ingredients_v1';
const SHOPPING_LIST_KEY = 'cooked_shopping_list_v1';

export const getStoredFavorites = (): string[] => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read favorites from localStorage', err);
    return [];
  }
};

export const toggleStoredFavorite = (recipeId: string): string[] => {
  try {
    const favorites = getStoredFavorites();
    const exists = favorites.includes(recipeId);
    const updated = exists 
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update favorites', err);
    return [];
  }
};

export const getStoredCustomRecipes = (): Recipe[] => {
  try {
    const data = localStorage.getItem(CUSTOM_RECIPES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read custom recipes', err);
    return [];
  }
};

export const saveStoredCustomRecipe = (recipe: Recipe): Recipe[] => {
  try {
    const existing = getStoredCustomRecipes();
    const updated = [recipe, ...existing];
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save custom recipe', err);
    return [];
  }
};

export const updateStoredCustomRecipe = (recipe: Recipe): Recipe[] => {
  try {
    const existing = getStoredCustomRecipes();
    const updated = existing.map((r) => (r.id === recipe.id ? recipe : r));
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update custom recipe', err);
    return [];
  }
};

export const deleteStoredCustomRecipe = (recipeId: string): Recipe[] => {
  try {
    const existing = getStoredCustomRecipes();
    const updated = existing.filter((r) => r.id !== recipeId);
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete custom recipe', err);
    return [];
  }
};

export const getCheckedIngredientsMap = (recipeId: string): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(`${CHECKED_INGREDIENTS_KEY}_${recipeId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const setCheckedIngredientsMap = (recipeId: string, map: Record<string, boolean>): void => {
  try {
    localStorage.setItem(`${CHECKED_INGREDIENTS_KEY}_${recipeId}`, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save ingredient check state', err);
  }
};

export const getStoredShoppingList = (): ShoppingItem[] => {
  try {
    const raw = localStorage.getItem(SHOPPING_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read shopping list', err);
    return [];
  }
};

export const saveStoredShoppingList = (items: ShoppingItem[]): void => {
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to write shopping list', err);
  }
};

export const addIngredientsToShoppingList = (
  ingredients: Ingredient[],
  recipeTitle: string,
  ratio = 1
): ShoppingItem[] => {
  const current = getStoredShoppingList();
  const newItems: ShoppingItem[] = ingredients.map((ing, idx) => ({
    id: `shop-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
    name: ing.name,
    amount: Math.round(ing.amount * ratio * 100) / 100,
    unit: ing.unit,
    category: ing.category || 'Pantry',
    recipeTitle,
    checked: false,
  }));

  const updated = [...current, ...newItems];
  saveStoredShoppingList(updated);
  return updated;
};

export const toggleShoppingItem = (id: string): ShoppingItem[] => {
  const current = getStoredShoppingList();
  const updated = current.map((item) =>
    item.id === id ? { ...item, checked: !item.checked } : item
  );
  saveStoredShoppingList(updated);
  return updated;
};

export const removeShoppingItem = (id: string): ShoppingItem[] => {
  const current = getStoredShoppingList();
  const updated = current.filter((item) => item.id !== id);
  saveStoredShoppingList(updated);
  return updated;
};

export const clearCheckedShoppingItems = (): ShoppingItem[] => {
  const current = getStoredShoppingList();
  const updated = current.filter((item) => !item.checked);
  saveStoredShoppingList(updated);
  return updated;
};

export const clearAllShoppingItems = (): ShoppingItem[] => {
  saveStoredShoppingList([]);
  return [];
};

export const addCustomShoppingItem = (
  name: string,
  amount: number,
  unit: string,
  category: IngredientAisle = 'Produce'
): ShoppingItem[] => {
  const current = getStoredShoppingList();
  const newItem: ShoppingItem = {
    id: `shop-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    amount: amount || 1,
    unit: unit.trim(),
    category,
    checked: false,
  };
  const updated = [newItem, ...current];
  saveStoredShoppingList(updated);
  return updated;
};
