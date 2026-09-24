export type Category = 
  | 'All' 
  | 'Quick Meals' 
  | 'Dinner' 
  | 'Breakfast' 
  | 'Healthy' 
  | 'Baking & Desserts';

export type Difficulty = 'Easy' | 'Medium' | 'Advanced';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category?: 'Produce' | 'Pantry' | 'Dairy & Eggs' | 'Meat & Seafood' | 'Spices';
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number;
  tip?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  category: Category;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  defaultServings: number;
  tags: string[];
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  steps: CookingStep[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isCustom?: boolean;
}

export type IngredientAisle = 'Produce' | 'Pantry' | 'Dairy & Eggs' | 'Meat & Seafood' | 'Spices' | 'Other';

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientAisle;
  recipeTitle?: string;
  checked: boolean;
}

