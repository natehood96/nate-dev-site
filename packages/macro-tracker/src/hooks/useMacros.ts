'use client';

import { useState, useCallback } from 'react';
import type { MacroEntry, DailyGoals, DailySummary } from '../types';

const DEFAULT_GOALS: DailyGoals = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 70,
};

// This is a placeholder hook - you can connect to a real backend later
export function useMacros() {
  const [entries, setEntries] = useState<MacroEntry[]>([]);
  const [goals] = useState<DailyGoals>(DEFAULT_GOALS);

  const addEntry = useCallback((entry: Omit<MacroEntry, 'id' | 'createdAt'>) => {
    const newEntry: MacroEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, newEntry]);
    return newEntry;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const getDailySummary = useCallback(
    (date: string): DailySummary => {
      const dayEntries = entries.filter((entry) => entry.date === date);
      const totals = dayEntries.reduce(
        (acc, entry) => ({
          calories: acc.calories + entry.calories,
          protein: acc.protein + entry.protein,
          carbs: acc.carbs + entry.carbs,
          fat: acc.fat + entry.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        date,
        totals,
        goals,
        entries: dayEntries,
      };
    },
    [entries, goals]
  );

  return {
    entries,
    goals,
    addEntry,
    removeEntry,
    getDailySummary,
  };
}
