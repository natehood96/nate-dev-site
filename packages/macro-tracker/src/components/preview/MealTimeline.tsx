'use client';

import { motion } from 'framer-motion';

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  time: string;
  icon: string;
}

const defaultMeals: Meal[] = [
  { id: '1', type: 'breakfast', name: 'Overnight Oats', calories: 380, time: '8:30 AM', icon: '🥣' },
  { id: '2', type: 'snack', name: 'Apple & Almonds', calories: 195, time: '10:45 AM', icon: '🍎' },
  { id: '3', type: 'lunch', name: 'Grilled Chicken Salad', calories: 450, time: '12:30 PM', icon: '🥗' },
  { id: '4', type: 'snack', name: 'Protein Shake', calories: 220, time: '3:00 PM', icon: '🥤' },
];

const mealTypeColors = {
  breakfast: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  lunch: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  dinner: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  snack: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

export function MealTimeline({ meals = defaultMeals }: { meals?: Meal[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mx-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[15px] font-semibold text-gray-900">Today's Meals</span>
        <span className="text-[11px] text-gray-400">Logged via ChatGPT</span>
      </div>

      {/* Meal cards */}
      <div className="space-y-2.5">
        {meals.map((meal, index) => {
          const colors = mealTypeColors[meal.type];
          return (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
            >
              {/* Icon container */}
              <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-xl`}>
                {meal.icon}
              </div>
              
              {/* Meal info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] font-semibold text-gray-900 truncate">{meal.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium ${colors.text} uppercase`}>
                    {meal.type}
                  </span>
                  <span className="text-[11px] text-gray-400">•</span>
                  <span className="text-[11px] text-gray-400">{meal.time}</span>
                </div>
              </div>

              {/* Calories */}
              <div className="text-right">
                <span className="text-[15px] font-semibold text-gray-900">{meal.calories}</span>
                <span className="text-[11px] text-gray-400 block">kcal</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dinner not yet logged hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-2.5"
      >
        <div className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 flex items-center justify-center gap-2">
          <span className="text-xl">🍽️</span>
          <span className="text-[13px] text-gray-500">Dinner will appear here once logged</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
