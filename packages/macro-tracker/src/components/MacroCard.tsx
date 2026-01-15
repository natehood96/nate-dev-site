'use client';

import { motion } from 'framer-motion';
import { cn } from '@nate/ui';

interface MacroCardProps {
  label: string;
  value: number;
  goal: number;
  unit?: string;
  color: string;
  icon: string;
}

export function MacroCard({ label, value, goal, unit = 'g', color, icon }: MacroCardProps) {
  const percentage = Math.min((value / goal) * 100, 100);
  const isOver = value > goal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={cn('text-sm font-medium', isOver ? 'text-red-500' : 'text-text-secondary')}>
          {value} / {goal} {unit}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-3">{label}</h3>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', color, isOver && 'bg-red-400')}
        />
      </div>

      <p className="text-sm text-text-secondary mt-2">
        {isOver ? (
          <span className="text-red-500">Over by {value - goal}{unit}</span>
        ) : (
          <span>{goal - value}{unit} remaining</span>
        )}
      </p>
    </motion.div>
  );
}
