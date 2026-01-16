/**
 * Daily Macro Calculator
 *
 * Calculates estimated daily calorie and macro targets based on
 * body metrics, activity level, and goals.
 *
 * Uses the Mifflin–St Jeor equation for BMR and standard
 * activity multipliers for TDEE.
 *
 * DISCLAIMER: These calculations provide estimated starting points
 * for awareness and reflection. They are not medical advice,
 * coaching prescriptions, or guaranteed results.
 */

// Types
export type {
  BiologicalSex,
  ActivityLevel,
  Goal,
  RateOfChange,
  MacroCalculatorInput,
  MacroTargets,
  MacroCalculatorResult,
} from './types';

// Constants (exported for testing and customization)
export {
  ACTIVITY_MULTIPLIERS,
  CALORIE_ADJUSTMENTS,
  MIN_CALORIES,
  CALORIES_PER_GRAM,
  PROTEIN_GRAMS_PER_LB,
  FAT_PERCENTAGE,
  KG_TO_LBS,
} from './types';

// Calculation functions
export {
  calculateBMR,
  calculateTDEE,
  applyGoalAdjustment,
  calculateProtein,
  calculateFat,
  calculateCarbs,
  calculateMacros,
  feetInchesToCm,
  lbsToKg,
} from './calculations';
