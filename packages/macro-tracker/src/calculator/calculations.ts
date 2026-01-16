/**
 * Daily Macro Calculator - Pure Calculation Functions
 *
 * All functions are pure (no side effects), deterministic, and testable.
 * Based on widely accepted nutrition formulas.
 *
 * IMPORTANT: These calculations provide estimated starting points,
 * not medical advice or guaranteed results.
 */

import {
  type BiologicalSex,
  type ActivityLevel,
  type Goal,
  type RateOfChange,
  type MacroCalculatorInput,
  type MacroCalculatorResult,
  ACTIVITY_MULTIPLIERS,
  CALORIE_ADJUSTMENTS,
  MIN_CALORIES,
  CALORIES_PER_GRAM,
  PROTEIN_GRAMS_PER_LB,
  FAT_PERCENTAGE,
  KG_TO_LBS,
} from './types';

/**
 * Calculate Basal Metabolic Rate using the Mifflin–St Jeor equation.
 *
 * Male:   BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
 * Female: BMR = (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161
 *
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @param age - Age in years
 * @param sex - Biological sex
 * @returns BMR in calories/day
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex
): number {
  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const sexAdjustment = sex === 'male' ? 5 : -161;
  return Math.round(baseBMR + sexAdjustment);
}

/**
 * Calculate Total Daily Energy Expenditure.
 *
 * TDEE = BMR × activity multiplier
 *
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - User's activity level
 * @returns TDEE in calories/day
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  return Math.round(bmr * multiplier);
}

/**
 * Apply goal-based calorie adjustment with safety guardrails.
 *
 * - Lose: Apply calorie deficit
 * - Maintain: No adjustment
 * - Gain: Apply calorie surplus
 *
 * Safety guardrails:
 * - Never recommend <1200 kcal/day for females
 * - Never recommend <1500 kcal/day for males
 *
 * @param tdee - Total Daily Energy Expenditure
 * @param goal - User's weight goal
 * @param rateOfChange - How aggressive the change
 * @param sex - Biological sex (for safety limits)
 * @returns Object with adjusted calories and whether guardrails were applied
 */
export function applyGoalAdjustment(
  tdee: number,
  goal: Goal,
  rateOfChange: RateOfChange,
  sex: BiologicalSex
): { targetCalories: number; guardrailsApplied: boolean } {
  let targetCalories = tdee;
  let guardrailsApplied = false;

  if (goal === 'lose') {
    const deficit = CALORIE_ADJUSTMENTS[rateOfChange];
    targetCalories = tdee - deficit;
  } else if (goal === 'gain') {
    const surplus = CALORIE_ADJUSTMENTS[rateOfChange];
    targetCalories = tdee + surplus;
  }
  // goal === 'maintain' → no adjustment

  // Apply safety guardrails
  const minCalories = MIN_CALORIES[sex];
  if (targetCalories < minCalories) {
    targetCalories = minCalories;
    guardrailsApplied = true;
  }

  return {
    targetCalories: Math.round(targetCalories),
    guardrailsApplied,
  };
}

/**
 * Calculate protein target based on body weight.
 *
 * Default: 0.8g per pound of body weight
 *
 * @param weightKg - Weight in kilograms
 * @returns Protein target in grams
 */
export function calculateProtein(weightKg: number): number {
  const weightLbs = weightKg * KG_TO_LBS;
  return Math.round(weightLbs * PROTEIN_GRAMS_PER_LB);
}

/**
 * Calculate fat target as percentage of total calories.
 *
 * Default: 25% of total calories (middle of 20-30% range)
 *
 * @param targetCalories - Daily calorie target
 * @returns Fat target in grams
 */
export function calculateFat(targetCalories: number): number {
  const fatCalories = targetCalories * FAT_PERCENTAGE;
  return Math.round(fatCalories / CALORIES_PER_GRAM.fat);
}

/**
 * Calculate carbs as remaining calories after protein and fat.
 *
 * @param targetCalories - Daily calorie target
 * @param proteinGrams - Protein in grams
 * @param fatGrams - Fat in grams
 * @returns Carbs target in grams
 */
export function calculateCarbs(
  targetCalories: number,
  proteinGrams: number,
  fatGrams: number
): number {
  const proteinCalories = proteinGrams * CALORIES_PER_GRAM.protein;
  const fatCalories = fatGrams * CALORIES_PER_GRAM.fat;
  const remainingCalories = targetCalories - proteinCalories - fatCalories;

  // Ensure we don't return negative carbs
  const carbGrams = Math.max(0, remainingCalories / CALORIES_PER_GRAM.carbs);
  return Math.round(carbGrams);
}

/**
 * Main calculator function - calculates all macro targets.
 *
 * This is the primary entry point for the calculator.
 * All intermediate calculations are exposed in the result for transparency.
 *
 * @param input - User inputs (sex, age, height, weight, activity, goal)
 * @returns Complete macro targets with metadata
 */
export function calculateMacros(input: MacroCalculatorInput): MacroCalculatorResult {
  const {
    biologicalSex,
    age,
    heightCm,
    weightKg,
    activityLevel,
    goal,
    rateOfChange = 'moderate',
  } = input;

  // Step 1: Calculate BMR
  const bmr = calculateBMR(weightKg, heightCm, age, biologicalSex);

  // Step 2: Calculate TDEE
  const tdee = calculateTDEE(bmr, activityLevel);

  // Step 3: Apply goal adjustment with safety guardrails
  const { targetCalories, guardrailsApplied } = applyGoalAdjustment(
    tdee,
    goal,
    rateOfChange,
    biologicalSex
  );

  // Step 4: Calculate macros
  const proteinGrams = calculateProtein(weightKg);
  const fatGrams = calculateFat(targetCalories);
  const carbsGrams = calculateCarbs(targetCalories, proteinGrams, fatGrams);

  return {
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    goal,
    rateOfChange: goal === 'maintain' ? null : rateOfChange,
    bmr,
    tdee,
    guardrailsApplied,
    isEstimate: true,
  };
}

/**
 * Utility: Convert height from feet/inches to centimeters
 *
 * @param feet - Height in feet
 * @param inches - Additional inches
 * @returns Height in centimeters
 */
export function feetInchesToCm(feet: number, inches: number = 0): number {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
}

/**
 * Utility: Convert weight from pounds to kilograms
 *
 * @param lbs - Weight in pounds
 * @returns Weight in kilograms
 */
export function lbsToKg(lbs: number): number {
  return lbs / KG_TO_LBS;
}
