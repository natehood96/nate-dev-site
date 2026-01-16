// Components
export { MacroCard, MacroDashboard } from './components';

// Hooks
export { useMacros } from './hooks/useMacros';

// Types
export type { MacroEntry, DailyGoals, DailySummary } from './types';

// Calculator
export {
  // Types
  type BiologicalSex,
  type ActivityLevel,
  type Goal,
  type RateOfChange,
  type MacroCalculatorInput,
  type MacroTargets,
  type MacroCalculatorResult,
  // Constants
  ACTIVITY_MULTIPLIERS,
  CALORIE_ADJUSTMENTS,
  MIN_CALORIES,
  CALORIES_PER_GRAM,
  PROTEIN_GRAMS_PER_LB,
  FAT_PERCENTAGE,
  KG_TO_LBS,
  // Functions
  calculateBMR,
  calculateTDEE,
  applyGoalAdjustment,
  calculateProtein,
  calculateFat,
  calculateCarbs,
  calculateMacros,
  feetInchesToCm,
  lbsToKg,
} from './calculator';
