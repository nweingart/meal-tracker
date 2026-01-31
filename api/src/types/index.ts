import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  gender: string | null;
  age: number | null;
  height_inches: number | null;
  weight_lbs: number | null;
  activity_level: string | null;
  diet_plan: string | null;
  calorie_target: number | null;
  protein_target_g: number | null;
  carbs_target_g: number | null;
  fat_target_g: number | null;
  created_at: string;
  updated_at: string;
}

export interface Food {
  id: string;
  user_id: string;
  name: string;
  serving_unit: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  times_used: number;
  created_at: string;
  updated_at: string;
}

export interface MealLogEntry {
  id: string;
  user_id: string;
  food_library_id: string;
  servings: number;
  logged_at: string;
  created_at: string;
  food?: Food;
}

export interface ParsedFood {
  name: string;
  servings: number;
  serving_unit: string;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
}
