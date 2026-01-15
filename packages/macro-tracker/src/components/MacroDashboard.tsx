'use client';

import { motion } from 'framer-motion';
import { Container, Button, Card } from '@nate/ui';
import { MacroCard } from './MacroCard';
import { useMacros } from '../hooks/useMacros';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MacroDashboard() {
  const { goals, getDailySummary } = useMacros();
  const today = new Date().toISOString().split('T')[0];
  const summary = getDailySummary(today);

  const macros = [
    {
      label: 'Calories',
      value: summary.totals.calories,
      goal: goals.calories,
      unit: 'kcal',
      color: 'bg-gradient-to-r from-orange-400 to-amber-500',
      icon: '🔥',
    },
    {
      label: 'Protein',
      value: summary.totals.protein,
      goal: goals.protein,
      color: 'bg-gradient-to-r from-red-400 to-rose-500',
      icon: '🥩',
    },
    {
      label: 'Carbs',
      value: summary.totals.carbs,
      goal: goals.carbs,
      color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
      icon: '🍞',
    },
    {
      label: 'Fat',
      value: summary.totals.fat,
      goal: goals.fat,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      icon: '🥑',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-4xl mb-4 block">🥗</span>
          <h1 className="text-4xl font-bold text-text-primary mb-4">Macro Tracker</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Track your daily nutrition and hit your macro goals. A simple, focused tool for mindful eating.
          </p>
        </motion.div>

        {/* Date display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <Card className="inline-block px-6 py-3">
            <span className="text-text-secondary">Today, </span>
            <span className="font-semibold text-text-primary">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </Card>
        </motion.div>

        {/* Macro cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {macros.map((macro) => (
            <motion.div key={macro.label} variants={itemVariants}>
              <MacroCard {...macro} />
            </motion.div>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button variant="primary" size="lg">
            + Add Meal
          </Button>
          <Button variant="secondary" size="lg">
            View History
          </Button>
        </motion.div>

        {/* Coming soon notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center"
        >
          <Card variant="glass" className="inline-block px-8 py-6">
            <p className="text-text-secondary">
              <span className="font-semibold text-text-primary">Coming soon:</span> Food database, meal presets, charts & analytics, and more!
            </p>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}
