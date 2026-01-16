'use client';

import { motion } from 'framer-motion';

interface MacroData {
  label: string;
  value: number;
  goal: number;
  color: string;
  bgColor: string;
}

const defaultMacros: MacroData[] = [
  { label: 'Protein', value: 87, goal: 150, color: '#f97316', bgColor: '#fff7ed' },
  { label: 'Carbs', value: 142, goal: 250, color: '#3b82f6', bgColor: '#eff6ff' },
  { label: 'Fat', value: 48, goal: 65, color: '#a855f7', bgColor: '#faf5ff' },
];

export function MacroDonutChart({ macros = defaultMacros }: { macros?: MacroData[] }) {
  const total = macros.reduce((sum, m) => sum + m.value, 0);
  
  // Calculate donut segments
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;
  
  const segments = macros.map((macro) => {
    const percentage = macro.value / total;
    const dashLength = circumference * percentage;
    const offset = currentOffset;
    currentOffset += dashLength;
    return { ...macro, dashLength, offset, percentage };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-3xl p-5 shadow-sm mx-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[15px] font-semibold text-gray-900">Macros</span>
        <span className="text-[13px] text-gray-400">{total}g total</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-[100px] h-[100px] flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="10"
            />
            {/* Macro segments */}
            {segments.map((segment, index) => (
              <motion.circle
                key={segment.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${segment.dashLength} ${circumference}`}
                strokeDashoffset={-segment.offset}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${segment.dashLength} ${circumference}` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] font-bold text-gray-900">{Math.round((total / 465) * 100)}%</span>
            <span className="text-[10px] text-gray-400 uppercase">of goal</span>
          </div>
        </div>

        {/* Macro list */}
        <div className="flex-1 space-y-3">
          {segments.map((macro, index) => (
            <motion.div
              key={macro.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: macro.color }}
                />
                <span className="text-[13px] font-medium text-gray-700">{macro.label}</span>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-semibold text-gray-900">{macro.value}g</span>
                <span className="text-[11px] text-gray-400"> / {macro.goal}g</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
