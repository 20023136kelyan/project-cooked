import { formatIngredientAmount } from './format';

export type UnitSystem = 'us' | 'metric';

interface ConvertedIngredient {
  amount: number;
  unit: string;
  formatted: string;
}

export const convertIngredientUnit = (
  amount: number,
  unit: string,
  targetSystem: UnitSystem
): ConvertedIngredient => {
  const normalizedUnit = unit.toLowerCase().trim();

  if (targetSystem === 'metric') {
    // Volume conversions to ml
    if (normalizedUnit === 'cup' || normalizedUnit === 'cups') {
      const ml = Math.round(amount * 240);
      if (ml >= 1000) {
        const liters = Math.round((ml / 1000) * 10) / 10;
        return { amount: liters, unit: 'L', formatted: `${liters} L` };
      }
      return { amount: ml, unit: 'ml', formatted: `${ml} ml` };
    }

    if (normalizedUnit === 'tbsp' || normalizedUnit === 'tablespoon' || normalizedUnit === 'tablespoons') {
      const ml = Math.round(amount * 15);
      return { amount: ml, unit: 'ml', formatted: `${ml} ml` };
    }

    if (normalizedUnit === 'tsp' || normalizedUnit === 'teaspoon' || normalizedUnit === 'teaspoons') {
      const ml = Math.round(amount * 5);
      return { amount: ml, unit: 'ml', formatted: `${ml} ml` };
    }

    if (normalizedUnit === 'fl oz' || normalizedUnit === 'fluid oz') {
      const ml = Math.round(amount * 30);
      return { amount: ml, unit: 'ml', formatted: `${ml} ml` };
    }

    // Weight conversions to g or kg
    if (normalizedUnit === 'oz' || normalizedUnit === 'ounce' || normalizedUnit === 'ounces') {
      const g = Math.round(amount * 28.35);
      return { amount: g, unit: 'g', formatted: `${g} g` };
    }

    if (normalizedUnit === 'lb' || normalizedUnit === 'lbs' || normalizedUnit === 'pound' || normalizedUnit === 'pounds') {
      const totalG = Math.round(amount * 453.6);
      if (totalG >= 1000) {
        const kg = Math.round((totalG / 1000) * 10) / 10;
        return { amount: kg, unit: 'kg', formatted: `${kg} kg` };
      }
      return { amount: totalG, unit: 'g', formatted: `${totalG} g` };
    }
  }

  // Target system is US or unit is count/non-convertible
  const formattedAmount = formatIngredientAmount(amount);
  return {
    amount,
    unit,
    formatted: formattedAmount ? `${formattedAmount} ${unit}` : unit,
  };
};
