/**
 * Daily Macro Calculator - Unit Tests
 *
 * Tests cover:
 * - BMR calculation (male/female)
 * - TDEE calculation per activity level
 * - Deficit/surplus application
 * - Safety guardrails (min calorie enforcement)
 * - Macro gram calculations
 * - Edge cases (small users, large users, sedentary + aggressive deficit, older age)
 */

import {
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
import {
  ACTIVITY_MULTIPLIERS,
  CALORIE_ADJUSTMENTS,
  MIN_CALORIES,
  CALORIES_PER_GRAM,
  KG_TO_LBS,
} from './types';

describe('calculateBMR', () => {
  describe('male BMR calculation', () => {
    it('calculates BMR correctly for average male', () => {
      // Male: BMR = (10 × 80) + (6.25 × 175) − (5 × 30) + 5
      // = 800 + 1093.75 - 150 + 5 = 1748.75 ≈ 1749
      const bmr = calculateBMR(80, 175, 30, 'male');
      expect(bmr).toBe(1749);
    });

    it('calculates BMR correctly for young male', () => {
      // Male: BMR = (10 × 70) + (6.25 × 180) − (5 × 20) + 5
      // = 700 + 1125 - 100 + 5 = 1730
      const bmr = calculateBMR(70, 180, 20, 'male');
      expect(bmr).toBe(1730);
    });

    it('calculates BMR correctly for older male', () => {
      // Male: BMR = (10 × 75) + (6.25 × 170) − (5 × 60) + 5
      // = 750 + 1062.5 - 300 + 5 = 1517.5 ≈ 1518
      const bmr = calculateBMR(75, 170, 60, 'male');
      expect(bmr).toBe(1518);
    });
  });

  describe('female BMR calculation', () => {
    it('calculates BMR correctly for average female', () => {
      // Female: BMR = (10 × 60) + (6.25 × 165) − (5 × 30) − 161
      // = 600 + 1031.25 - 150 - 161 = 1320.25 ≈ 1320
      const bmr = calculateBMR(60, 165, 30, 'female');
      expect(bmr).toBe(1320);
    });

    it('calculates BMR correctly for young female', () => {
      // Female: BMR = (10 × 55) + (6.25 × 160) − (5 × 22) − 161
      // = 550 + 1000 - 110 - 161 = 1279
      const bmr = calculateBMR(55, 160, 22, 'female');
      expect(bmr).toBe(1279);
    });

    it('calculates BMR correctly for older female', () => {
      // Female: BMR = (10 × 65) + (6.25 × 160) − (5 × 55) − 161
      // = 650 + 1000 - 275 - 161 = 1214
      const bmr = calculateBMR(65, 160, 55, 'female');
      expect(bmr).toBe(1214);
    });
  });

  describe('edge cases', () => {
    it('handles very small user (45kg, 150cm)', () => {
      // Male: BMR = (10 × 45) + (6.25 × 150) − (5 × 25) + 5
      // = 450 + 937.5 - 125 + 5 = 1267.5 ≈ 1268
      const bmr = calculateBMR(45, 150, 25, 'male');
      expect(bmr).toBe(1268);
    });

    it('handles very large user (130kg, 200cm)', () => {
      // Male: BMR = (10 × 130) + (6.25 × 200) − (5 × 35) + 5
      // = 1300 + 1250 - 175 + 5 = 2380
      const bmr = calculateBMR(130, 200, 35, 'male');
      expect(bmr).toBe(2380);
    });

    it('handles older age (75 years)', () => {
      // Female: BMR = (10 × 60) + (6.25 × 160) − (5 × 75) − 161
      // = 600 + 1000 - 375 - 161 = 1064
      const bmr = calculateBMR(60, 160, 75, 'female');
      expect(bmr).toBe(1064);
    });
  });
});

describe('calculateTDEE', () => {
  const testBMR = 1500;

  it('calculates TDEE for sedentary activity', () => {
    const tdee = calculateTDEE(testBMR, 'sedentary');
    expect(tdee).toBe(Math.round(testBMR * ACTIVITY_MULTIPLIERS.sedentary));
    expect(tdee).toBe(1800);
  });

  it('calculates TDEE for light activity', () => {
    const tdee = calculateTDEE(testBMR, 'light');
    expect(tdee).toBe(Math.round(testBMR * ACTIVITY_MULTIPLIERS.light));
    expect(tdee).toBe(2063);
  });

  it('calculates TDEE for moderate activity', () => {
    const tdee = calculateTDEE(testBMR, 'moderate');
    expect(tdee).toBe(Math.round(testBMR * ACTIVITY_MULTIPLIERS.moderate));
    expect(tdee).toBe(2325);
  });

  it('calculates TDEE for very active', () => {
    const tdee = calculateTDEE(testBMR, 'very_active');
    expect(tdee).toBe(Math.round(testBMR * ACTIVITY_MULTIPLIERS.very_active));
    expect(tdee).toBe(2588);
  });

  it('verifies all activity multipliers are applied correctly', () => {
    Object.entries(ACTIVITY_MULTIPLIERS).forEach(([level, multiplier]) => {
      const tdee = calculateTDEE(testBMR, level as keyof typeof ACTIVITY_MULTIPLIERS);
      expect(tdee).toBe(Math.round(testBMR * multiplier));
    });
  });
});

describe('applyGoalAdjustment', () => {
  describe('maintain goal', () => {
    it('returns TDEE unchanged for maintain goal', () => {
      const result = applyGoalAdjustment(2000, 'maintain', 'moderate', 'male');
      expect(result.targetCalories).toBe(2000);
      expect(result.guardrailsApplied).toBe(false);
    });
  });

  describe('lose goal', () => {
    it('applies slow deficit (-250 kcal)', () => {
      const result = applyGoalAdjustment(2000, 'lose', 'slow', 'male');
      expect(result.targetCalories).toBe(2000 - CALORIE_ADJUSTMENTS.slow);
      expect(result.targetCalories).toBe(1750);
      expect(result.guardrailsApplied).toBe(false);
    });

    it('applies moderate deficit (-500 kcal)', () => {
      const result = applyGoalAdjustment(2000, 'lose', 'moderate', 'male');
      expect(result.targetCalories).toBe(2000 - CALORIE_ADJUSTMENTS.moderate);
      expect(result.targetCalories).toBe(1500);
      expect(result.guardrailsApplied).toBe(false);
    });

    it('applies aggressive deficit (-750 kcal)', () => {
      const result = applyGoalAdjustment(2500, 'lose', 'aggressive', 'male');
      expect(result.targetCalories).toBe(2500 - CALORIE_ADJUSTMENTS.aggressive);
      expect(result.targetCalories).toBe(1750);
      expect(result.guardrailsApplied).toBe(false);
    });
  });

  describe('gain goal', () => {
    it('applies slow surplus (+250 kcal)', () => {
      const result = applyGoalAdjustment(2000, 'gain', 'slow', 'male');
      expect(result.targetCalories).toBe(2000 + CALORIE_ADJUSTMENTS.slow);
      expect(result.targetCalories).toBe(2250);
      expect(result.guardrailsApplied).toBe(false);
    });

    it('applies moderate surplus (+500 kcal)', () => {
      const result = applyGoalAdjustment(2000, 'gain', 'moderate', 'male');
      expect(result.targetCalories).toBe(2000 + CALORIE_ADJUSTMENTS.moderate);
      expect(result.targetCalories).toBe(2500);
      expect(result.guardrailsApplied).toBe(false);
    });

    it('applies aggressive surplus (+750 kcal)', () => {
      const result = applyGoalAdjustment(2000, 'gain', 'aggressive', 'male');
      expect(result.targetCalories).toBe(2000 + CALORIE_ADJUSTMENTS.aggressive);
      expect(result.targetCalories).toBe(2750);
      expect(result.guardrailsApplied).toBe(false);
    });
  });

  describe('safety guardrails', () => {
    it('enforces minimum 1500 kcal for males', () => {
      // TDEE 1800, aggressive deficit = 1050, should floor to 1500
      const result = applyGoalAdjustment(1800, 'lose', 'aggressive', 'male');
      expect(result.targetCalories).toBe(MIN_CALORIES.male);
      expect(result.targetCalories).toBe(1500);
      expect(result.guardrailsApplied).toBe(true);
    });

    it('enforces minimum 1200 kcal for females', () => {
      // TDEE 1500, aggressive deficit = 750, should floor to 1200
      const result = applyGoalAdjustment(1500, 'lose', 'aggressive', 'female');
      expect(result.targetCalories).toBe(MIN_CALORIES.female);
      expect(result.targetCalories).toBe(1200);
      expect(result.guardrailsApplied).toBe(true);
    });

    it('does not apply guardrails when above minimum (male)', () => {
      const result = applyGoalAdjustment(2100, 'lose', 'moderate', 'male');
      expect(result.targetCalories).toBe(1600);
      expect(result.guardrailsApplied).toBe(false);
    });

    it('does not apply guardrails when above minimum (female)', () => {
      const result = applyGoalAdjustment(1800, 'lose', 'moderate', 'female');
      expect(result.targetCalories).toBe(1300);
      expect(result.guardrailsApplied).toBe(false);
    });

    it('handles sedentary + aggressive deficit for small female', () => {
      // Small sedentary female with aggressive deficit
      // TDEE ~1400, aggressive deficit would give 650, floors to 1200
      const result = applyGoalAdjustment(1400, 'lose', 'aggressive', 'female');
      expect(result.targetCalories).toBe(1200);
      expect(result.guardrailsApplied).toBe(true);
    });
  });
});

describe('calculateProtein', () => {
  it('calculates protein for average weight (70kg)', () => {
    // 70kg × 2.20462 = 154.32 lbs × 0.8 = 123.46 ≈ 123g
    const protein = calculateProtein(70);
    expect(protein).toBe(123);
  });

  it('calculates protein for lighter weight (55kg)', () => {
    // 55kg × 2.20462 = 121.25 lbs × 0.8 = 97g
    const protein = calculateProtein(55);
    expect(protein).toBe(97);
  });

  it('calculates protein for heavier weight (100kg)', () => {
    // 100kg × 2.20462 = 220.46 lbs × 0.8 = 176.37 ≈ 176g
    const protein = calculateProtein(100);
    expect(protein).toBe(176);
  });

  it('handles edge case of very small weight (45kg)', () => {
    // 45kg × 2.20462 = 99.21 lbs × 0.8 = 79.37 ≈ 79g
    const protein = calculateProtein(45);
    expect(protein).toBe(79);
  });

  it('handles edge case of very large weight (130kg)', () => {
    // 130kg × 2.20462 = 286.6 lbs × 0.8 = 229.28 ≈ 229g
    const protein = calculateProtein(130);
    expect(protein).toBe(229);
  });
});

describe('calculateFat', () => {
  it('calculates fat for 2000 calorie target', () => {
    // 2000 × 0.25 = 500 kcal / 9 = 55.56 ≈ 56g
    const fat = calculateFat(2000);
    expect(fat).toBe(56);
  });

  it('calculates fat for 1500 calorie target', () => {
    // 1500 × 0.25 = 375 kcal / 9 = 41.67 ≈ 42g
    const fat = calculateFat(1500);
    expect(fat).toBe(42);
  });

  it('calculates fat for 2500 calorie target', () => {
    // 2500 × 0.25 = 625 kcal / 9 = 69.44 ≈ 69g
    const fat = calculateFat(2500);
    expect(fat).toBe(69);
  });

  it('calculates fat for minimum female calories (1200)', () => {
    // 1200 × 0.25 = 300 kcal / 9 = 33.33 ≈ 33g
    const fat = calculateFat(1200);
    expect(fat).toBe(33);
  });
});

describe('calculateCarbs', () => {
  it('calculates carbs as remaining calories', () => {
    // 2000 total, 120g protein (480 kcal), 50g fat (450 kcal)
    // Remaining: 2000 - 480 - 450 = 1070 kcal / 4 = 267.5 ≈ 268g
    const carbs = calculateCarbs(2000, 120, 50);
    expect(carbs).toBe(268);
  });

  it('calculates carbs for low calorie diet', () => {
    // 1200 total, 100g protein (400 kcal), 35g fat (315 kcal)
    // Remaining: 1200 - 400 - 315 = 485 kcal / 4 = 121.25 ≈ 121g
    const carbs = calculateCarbs(1200, 100, 35);
    expect(carbs).toBe(121);
  });

  it('returns 0 when protein and fat exceed calories', () => {
    // This edge case shouldn't happen with normal inputs, but test the safety
    // 1000 total, 200g protein (800 kcal), 100g fat (900 kcal) = 1700 kcal
    // Would be negative, should return 0
    const carbs = calculateCarbs(1000, 200, 100);
    expect(carbs).toBe(0);
  });

  it('handles high calorie surplus scenario', () => {
    // 3000 total, 150g protein (600 kcal), 80g fat (720 kcal)
    // Remaining: 3000 - 600 - 720 = 1680 kcal / 4 = 420g
    const carbs = calculateCarbs(3000, 150, 80);
    expect(carbs).toBe(420);
  });
});

describe('calculateMacros (integration)', () => {
  describe('typical use cases', () => {
    it('calculates macros for average male wanting to lose weight', () => {
      const result = calculateMacros({
        biologicalSex: 'male',
        age: 30,
        heightCm: 175,
        weightKg: 80,
        activityLevel: 'moderate',
        goal: 'lose',
        rateOfChange: 'moderate',
      });

      // Verify structure
      expect(result.isEstimate).toBe(true);
      expect(result.goal).toBe('lose');
      expect(result.rateOfChange).toBe('moderate');

      // BMR = 1749, TDEE = 1749 × 1.55 = 2711
      expect(result.bmr).toBe(1749);
      expect(result.tdee).toBe(2711);

      // Target = 2711 - 500 = 2211
      expect(result.targetCalories).toBe(2211);
      expect(result.guardrailsApplied).toBe(false);

      // Protein: 80kg × 2.20462 × 0.8 = 141g
      expect(result.proteinGrams).toBe(141);

      // Fat: 2211 × 0.25 / 9 = 61g
      expect(result.fatGrams).toBe(61);

      // Carbs: (2211 - (141×4) - (61×9)) / 4 = (2211 - 564 - 549) / 4 = 274.5 ≈ 275g
      expect(result.carbsGrams).toBe(275);
    });

    it('calculates macros for average female wanting to maintain', () => {
      const result = calculateMacros({
        biologicalSex: 'female',
        age: 28,
        heightCm: 165,
        weightKg: 60,
        activityLevel: 'light',
        goal: 'maintain',
      });

      expect(result.goal).toBe('maintain');
      expect(result.rateOfChange).toBe(null);
      expect(result.guardrailsApplied).toBe(false);

      // BMR = (10 × 60) + (6.25 × 165) − (5 × 28) − 161 = 1330
      expect(result.bmr).toBe(1330);

      // TDEE = 1330 × 1.375 = 1829
      expect(result.tdee).toBe(1829);
      expect(result.targetCalories).toBe(1829);
    });

    it('calculates macros for male wanting to gain weight', () => {
      const result = calculateMacros({
        biologicalSex: 'male',
        age: 25,
        heightCm: 180,
        weightKg: 70,
        activityLevel: 'very_active',
        goal: 'gain',
        rateOfChange: 'moderate',
      });

      expect(result.goal).toBe('gain');
      expect(result.rateOfChange).toBe('moderate');

      // BMR = (10 × 70) + (6.25 × 180) − (5 × 25) + 5
      // = 700 + 1125 - 125 + 5 = 1705
      expect(result.bmr).toBe(1705);

      // TDEE = 1705 × 1.725 = 2941
      expect(result.tdee).toBe(2941);

      // Target = 2941 + 500 = 3441
      expect(result.targetCalories).toBe(3441);
    });
  });

  describe('edge cases', () => {
    it('applies safety guardrails for sedentary female with aggressive deficit', () => {
      const result = calculateMacros({
        biologicalSex: 'female',
        age: 40,
        heightCm: 155,
        weightKg: 55,
        activityLevel: 'sedentary',
        goal: 'lose',
        rateOfChange: 'aggressive',
      });

      // BMR = (10 × 55) + (6.25 × 155) − (5 × 40) − 161 = 1157
      expect(result.bmr).toBe(1158);

      // TDEE = 1158 × 1.2 = 1390 (rounded)
      expect(result.tdee).toBe(1390);

      // Without guardrail: 1390 - 750 = 640 (below minimum)
      // With guardrail: floors to 1200
      expect(result.targetCalories).toBe(1200);
      expect(result.guardrailsApplied).toBe(true);
    });

    it('applies safety guardrails for sedentary male with aggressive deficit', () => {
      const result = calculateMacros({
        biologicalSex: 'male',
        age: 50,
        heightCm: 165,
        weightKg: 65,
        activityLevel: 'sedentary',
        goal: 'lose',
        rateOfChange: 'aggressive',
      });

      // BMR = (10 × 65) + (6.25 × 165) − (5 × 50) + 5
      // = 650 + 1031.25 - 250 + 5 = 1436.25 ≈ 1436
      expect(result.bmr).toBe(1436);

      // TDEE = 1436 × 1.2 = 1723.2 ≈ 1723
      expect(result.tdee).toBe(1723);

      // Without guardrail: 1723 - 750 = 973 (below minimum)
      // With guardrail: floors to 1500
      expect(result.targetCalories).toBe(1500);
      expect(result.guardrailsApplied).toBe(true);
    });

    it('handles very small user correctly', () => {
      const result = calculateMacros({
        biologicalSex: 'female',
        age: 22,
        heightCm: 150,
        weightKg: 45,
        activityLevel: 'light',
        goal: 'maintain',
      });

      // BMR = (10 × 45) + (6.25 × 150) − (5 × 22) − 161
      // = 450 + 937.5 - 110 - 161 = 1116.5 ≈ 1117
      expect(result.bmr).toBe(1117);

      // TDEE = 1117 × 1.375 = 1535.875 ≈ 1536
      expect(result.tdee).toBe(1536);
      expect(result.targetCalories).toBe(1536);

      // Protein: 45kg × 2.20462 × 0.8 = 79.37 ≈ 79g
      expect(result.proteinGrams).toBe(79);
      expect(result.guardrailsApplied).toBe(false);
    });

    it('handles very large user correctly', () => {
      const result = calculateMacros({
        biologicalSex: 'male',
        age: 35,
        heightCm: 200,
        weightKg: 130,
        activityLevel: 'moderate',
        goal: 'lose',
        rateOfChange: 'slow',
      });

      // BMR = (10 × 130) + (6.25 × 200) − (5 × 35) + 5 = 2380
      expect(result.bmr).toBe(2380);

      // TDEE = 2380 × 1.55 = 3689
      expect(result.tdee).toBe(3689);

      // Target = 3689 - 250 = 3439
      expect(result.targetCalories).toBe(3439);

      // Protein: 130kg × 2.20462 × 0.8 = 229g
      expect(result.proteinGrams).toBe(229);
    });

    it('handles older user (70 years)', () => {
      const result = calculateMacros({
        biologicalSex: 'male',
        age: 70,
        heightCm: 170,
        weightKg: 75,
        activityLevel: 'light',
        goal: 'maintain',
      });

      // BMR = (10 × 75) + (6.25 × 170) − (5 × 70) + 5 = 1468
      expect(result.bmr).toBe(1468);
      expect(result.tdee).toBe(2019);
    });

    it('defaults to moderate rate when not specified', () => {
      const result = calculateMacros({
        biologicalSex: 'male',
        age: 30,
        heightCm: 175,
        weightKg: 80,
        activityLevel: 'moderate',
        goal: 'lose',
        // rateOfChange not specified
      });

      // Should default to moderate (-500)
      expect(result.rateOfChange).toBe('moderate');
      expect(result.targetCalories).toBe(result.tdee - 500);
    });
  });

  describe('macro calorie verification', () => {
    it('ensures macros approximately sum to target calories', () => {
      const result = calculateMacros({
        biologicalSex: 'male',
        age: 30,
        heightCm: 175,
        weightKg: 80,
        activityLevel: 'moderate',
        goal: 'maintain',
      });

      const calculatedCalories =
        result.proteinGrams * CALORIES_PER_GRAM.protein +
        result.carbsGrams * CALORIES_PER_GRAM.carbs +
        result.fatGrams * CALORIES_PER_GRAM.fat;

      // Allow for rounding differences (within 10 kcal)
      expect(Math.abs(calculatedCalories - result.targetCalories)).toBeLessThan(10);
    });
  });
});

describe('utility functions', () => {
  describe('feetInchesToCm', () => {
    it('converts 5\'10" to cm', () => {
      const cm = feetInchesToCm(5, 10);
      // (5 × 12 + 10) × 2.54 = 70 × 2.54 = 177.8 ≈ 178
      expect(cm).toBe(178);
    });

    it('converts 6\'0" to cm', () => {
      const cm = feetInchesToCm(6, 0);
      // (6 × 12) × 2.54 = 72 × 2.54 = 182.88 ≈ 183
      expect(cm).toBe(183);
    });

    it('converts 5\'4" to cm', () => {
      const cm = feetInchesToCm(5, 4);
      // (5 × 12 + 4) × 2.54 = 64 × 2.54 = 162.56 ≈ 163
      expect(cm).toBe(163);
    });

    it('handles feet only', () => {
      const cm = feetInchesToCm(5);
      // (5 × 12) × 2.54 = 60 × 2.54 = 152.4 ≈ 152
      expect(cm).toBe(152);
    });
  });

  describe('lbsToKg', () => {
    it('converts 150 lbs to kg', () => {
      const kg = lbsToKg(150);
      expect(kg).toBeCloseTo(68.04, 1);
    });

    it('converts 200 lbs to kg', () => {
      const kg = lbsToKg(200);
      expect(kg).toBeCloseTo(90.72, 1);
    });

    it('converts 120 lbs to kg', () => {
      const kg = lbsToKg(120);
      expect(kg).toBeCloseTo(54.43, 1);
    });
  });
});

describe('constants verification', () => {
  it('has correct activity multipliers', () => {
    expect(ACTIVITY_MULTIPLIERS.sedentary).toBe(1.2);
    expect(ACTIVITY_MULTIPLIERS.light).toBe(1.375);
    expect(ACTIVITY_MULTIPLIERS.moderate).toBe(1.55);
    expect(ACTIVITY_MULTIPLIERS.very_active).toBe(1.725);
  });

  it('has correct calorie adjustments', () => {
    expect(CALORIE_ADJUSTMENTS.slow).toBe(250);
    expect(CALORIE_ADJUSTMENTS.moderate).toBe(500);
    expect(CALORIE_ADJUSTMENTS.aggressive).toBe(750);
  });

  it('has correct minimum calories', () => {
    expect(MIN_CALORIES.female).toBe(1200);
    expect(MIN_CALORIES.male).toBe(1500);
  });

  it('has correct calorie per gram values', () => {
    expect(CALORIES_PER_GRAM.protein).toBe(4);
    expect(CALORIES_PER_GRAM.carbs).toBe(4);
    expect(CALORIES_PER_GRAM.fat).toBe(9);
  });

  it('has correct conversion constant', () => {
    expect(KG_TO_LBS).toBeCloseTo(2.20462, 4);
  });
});
