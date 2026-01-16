'use client';

import { motion } from 'framer-motion';

interface TrendsCardProps {
  streak: number;
  weeklyAverage: number;
  weeklyGoal: number;
  weekData: number[];
}

const defaultProps: TrendsCardProps = {
  streak: 12,
  weeklyAverage: 1847,
  weeklyGoal: 2000,
  weekData: [1920, 1780, 2100, 1650, 1890, 1950, 1247], // Last 7 days
};

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function TrendsCard({
  streak = defaultProps.streak,
  weeklyAverage = defaultProps.weeklyAverage,
  weeklyGoal = defaultProps.weeklyGoal,
  weekData = defaultProps.weekData,
}: Partial<TrendsCardProps>) {
  const maxValue = Math.max(...weekData, weeklyGoal);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-3xl p-5 shadow-sm mx-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[15px] font-semibold text-gray-900">This Week</span>
        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full">
          <span className="text-sm">🔥</span>
          <span className="text-[12px] font-semibold text-amber-600">{streak} day streak</span>
        </div>
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end justify-between gap-2 h-[80px] mb-3">
        {weekData.map((value, index) => {
          const height = (value / maxValue) * 100;
          const isToday = index === weekData.length - 1;
          const isOnTarget = value >= weeklyGoal * 0.9 && value <= weeklyGoal * 1.1;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full rounded-lg ${
                  isToday 
                    ? 'bg-gradient-to-t from-blue-500 to-blue-400' 
                    : isOnTarget 
                      ? 'bg-emerald-400'
                      : 'bg-gray-200'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex justify-between gap-2 mb-4">
        {days.map((day, index) => (
          <span 
            key={index}
            className={`flex-1 text-center text-[11px] font-medium ${
              index === days.length - 1 ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* Goal line indicator */}
      <div className="relative h-[1px] bg-gray-100 mb-4">
        <div 
          className="absolute left-0 right-0 h-[1px] border-t border-dashed border-emerald-300"
          style={{ top: 0 }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-0.5">Avg Daily</div>
          <div className="text-[18px] font-bold text-gray-900">{weeklyAverage.toLocaleString()} kcal</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-0.5">vs Goal</div>
          <div className={`text-[18px] font-bold ${
            weeklyAverage < weeklyGoal ? 'text-emerald-500' : 'text-orange-500'
          }`}>
            {weeklyAverage < weeklyGoal ? '-' : '+'}{Math.abs(weeklyGoal - weeklyAverage)} kcal
          </div>
        </div>
      </div>
    </motion.div>
  );
}
