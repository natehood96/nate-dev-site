'use client';

import { motion } from 'framer-motion';

interface DailySummaryCardProps {
  calories: number;
  caloriesGoal: number;
  caloriesBurned?: number;
}

export function DailySummaryCard({ 
  calories = 1247, 
  caloriesGoal = 2000,
  caloriesBurned = 320 
}: Partial<DailySummaryCardProps>) {
  const remaining = caloriesGoal - calories + caloriesBurned;
  const progress = (calories / caloriesGoal) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl p-5 shadow-sm mx-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-medium text-gray-500 uppercase tracking-wide">Today</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[13px] font-medium text-emerald-600">On Track</span>
        </div>
      </div>

      {/* Main calorie display */}
      <div className="flex items-end gap-2 mb-1">
        <span className="text-[56px] font-bold text-gray-900 leading-none tracking-tight">
          {remaining.toLocaleString()}
        </span>
        <span className="text-lg text-gray-400 mb-2">kcal left</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-[22px] font-semibold text-gray-900">{calories.toLocaleString()}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Eaten</div>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="text-[22px] font-semibold text-orange-500">-{caloriesBurned}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Burned</div>
        </div>
        <div className="text-center">
          <div className="text-[22px] font-semibold text-gray-900">{caloriesGoal.toLocaleString()}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Goal</div>
        </div>
      </div>
    </motion.div>
  );
}
