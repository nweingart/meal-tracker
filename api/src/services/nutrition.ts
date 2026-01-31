interface TDEEInput {
  gender: 'male' | 'female' | 'other';
  age: number;
  height_inches: number;
  weight_lbs: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateTDEE(input: TDEEInput): number {
  // Convert to metric
  const weightKg = input.weight_lbs * 0.453592;
  const heightCm = input.height_inches * 2.54;

  // Mifflin-St Jeor Equation
  let bmr: number;
  if (input.gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * input.age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * input.age - 161;
  }

  const tdee = bmr * ACTIVITY_MULTIPLIERS[input.activity_level];
  return Math.round(tdee);
}

export function calculateMacroTargets(
  tdee: number,
  goal: 'maintain' | 'lose' | 'gain',
  weight_lbs: number
): MacroTargets {
  // Adjust calories based on goal
  let targetCalories: number;
  switch (goal) {
    case 'lose':
      targetCalories = tdee - 500; // 500 calorie deficit
      break;
    case 'gain':
      targetCalories = tdee + 300; // 300 calorie surplus
      break;
    default:
      targetCalories = tdee;
  }

  // Protein: 0.8-1g per lb of body weight
  const protein = Math.round(weight_lbs * 0.9);

  // Fat: 25-30% of calories
  const fatCalories = targetCalories * 0.28;
  const fat = Math.round(fatCalories / 9);

  // Carbs: remaining calories
  const proteinCalories = protein * 4;
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4);

  return {
    calories: Math.round(targetCalories),
    protein,
    carbs,
    fat,
  };
}
