/**
 * Daily Macro Calculator Types
 *
 * These types define the inputs and outputs for calculating
 * daily calorie and macro targets based on body metrics,
 * activity level, and goals.
 */

/** Biological sex - used for BMR calculation (sex-specific constants) */
export type BiologicalSex = 'male' | 'female';

/** Activity level - determines TDEE multiplier */
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

/** Goal - determines calorie adjustment direction */
export type Goal = 'lose' | 'maintain' | 'gain';

/** Rate of change - how aggressive the deficit/surplus */
export type RateOfChange = 'slow' | 'moderate' | 'aggressive';

/**
 * User inputs for the macro calculator
 */
export interface MacroCalculatorInput {
  /** Biological sex for BMR calculation */
  biologicalSex: BiologicalSex;

  /** Age in years */
  age: number;

  /** Height in centimeters */
  heightCm: number;

  /** Current weight in kilograms */
  weightKg: number;

  /** Activity level */
  activityLevel: ActivityLevel;

  /** Weight goal */
  goal: Goal;

  /** Rate of change (optional, defaults to 'moderate') */
  rateOfChange?: RateOfChange;
}

/**
 * Calculated macro targets
 */
export interface MacroTargets {
  /** Daily calorie target */
  targetCalories: number;

  /** Daily protein target in grams */
  proteinGrams: number;

  /** Daily carbohydrate target in grams */
  carbsGrams: number;

  /** Daily fat target in grams */
  fatGrams: number;
}

/**
 * Full calculator output with metadata
 */
export interface MacroCalculatorResult extends MacroTargets {
  /** The goal used for calculation */
  goal: Goal;

  /** The rate of change applied (null for maintain) */
  rateOfChange: RateOfChange | null;

  /** Calculated Basal Metabolic Rate */
  bmr: number;

  /** Calculated Total Daily Energy Expenditure */
  tdee: number;

  /** Whether safety guardrails were applied */
  guardrailsApplied: boolean;

  /** Disclaimer: this is an estimate, not a prescription */
  isEstimate: true;
}

/**
 * Activity level multipliers for TDEE calculation
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

/**
 * Calorie adjustments per rate of change
 */
export const CALORIE_ADJUSTMENTS: Record<RateOfChange, number> = {
  slow: 250,
  moderate: 500,
  aggressive: 750,
};

/**
 * Minimum safe calorie thresholds by sex
 */
export const MIN_CALORIES: Record<BiologicalSex, number> = {
  female: 1200,
  male: 1500,
};

/**
 * Macronutrient calorie values per gram
 */
export const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

/**
 * Protein factor: grams per pound of body weight
 */
export const PROTEIN_GRAMS_PER_LB = 0.8;

/**
 * Fat percentage of total calories (using middle of 20-30% range)
 */
export const FAT_PERCENTAGE = 0.25;

/**
 * Conversion constants
 */
export const KG_TO_LBS = 2.20462;
