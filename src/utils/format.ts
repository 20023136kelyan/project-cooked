export const formatIngredientAmount = (amount: number): string => {
  if (!amount || isNaN(amount)) return '';
  
  // Round to 2 decimal places to avoid 0.33333333334
  const rounded = Math.round(amount * 100) / 100;
  
  // Common fraction checks
  const whole = Math.floor(rounded);
  const frac = rounded - whole;
  
  let fracStr = '';
  if (Math.abs(frac - 0.25) < 0.05) fracStr = '¼';
  else if (Math.abs(frac - 0.33) < 0.05) fracStr = '⅓';
  else if (Math.abs(frac - 0.5) < 0.05) fracStr = '½';
  else if (Math.abs(frac - 0.66) < 0.05) fracStr = '⅔';
  else if (Math.abs(frac - 0.75) < 0.05) fracStr = '¾';

  if (fracStr) {
    return whole > 0 ? `${whole} ${fracStr}` : fracStr;
  }
  
  return rounded.toString();
};
