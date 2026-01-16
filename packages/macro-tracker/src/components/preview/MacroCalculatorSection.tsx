'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateMacros,
  feetInchesToCm,
  lbsToKg,
  type BiologicalSex,
  type ActivityLevel,
  type Goal,
  type RateOfChange,
  type MacroCalculatorResult,
} from '../../calculator';
import {
  CalculatorIcon,
  MaleIcon,
  FemaleIcon,
  TrendDownIcon,
  BalanceIcon,
  TrendUpIcon,
  TargetIcon,
  CheckCircleIcon,
  SparklesIcon,
} from './Icons';
import { ChatGPTSetupModal, useChatGPTSetupModal, generatePrompt } from './ChatGPTSetupModal';

type UnitSystem = 'metric' | 'imperial';

interface FormState {
  biologicalSex: BiologicalSex;
  age: string;
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLbs: string;
  weightKg: string;
  activityLevel: ActivityLevel;
  goal: Goal;
  rateOfChange: RateOfChange;
  unitSystem: UnitSystem;
}

const initialFormState: FormState = {
  biologicalSex: 'male',
  age: '30',
  heightFeet: '5',
  heightInches: '10',
  heightCm: '178',
  weightLbs: '165',
  weightKg: '75',
  activityLevel: 'moderate',
  goal: 'maintain',
  rateOfChange: 'moderate',
  unitSystem: 'imperial',
};

const activityOptions: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Lightly Active', description: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', description: '3-5 days/week' },
  { value: 'very_active', label: 'Very Active', description: '6-7 days/week' },
];

const goalOptions: { value: Goal; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'lose', label: 'Lose Weight', Icon: TrendDownIcon },
  { value: 'maintain', label: 'Maintain', Icon: BalanceIcon },
  { value: 'gain', label: 'Gain Weight', Icon: TrendUpIcon },
];

const rateOptions: { value: RateOfChange; label: string; description: string }[] = [
  { value: 'slow', label: 'Slow', description: '~0.5 lb/week' },
  { value: 'moderate', label: 'Moderate', description: '~1 lb/week' },
  { value: 'aggressive', label: 'Aggressive', description: '~1.5 lb/week' },
];

export function MacroCalculatorSection() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [instructionsCopied, setInstructionsCopied] = useState(false);
  const chatGPTModal = useChatGPTSetupModal();

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setShowResults(false);
  };

  const isFormValid = useMemo(() => {
    const age = parseInt(form.age);
    if (isNaN(age) || age < 15 || age > 100) return false;

    if (form.unitSystem === 'imperial') {
      const feet = parseInt(form.heightFeet);
      const inches = parseInt(form.heightInches);
      const weight = parseFloat(form.weightLbs);
      if (isNaN(feet) || isNaN(inches) || isNaN(weight)) return false;
      if (weight < 80 || weight > 500) return false;
    } else {
      const height = parseFloat(form.heightCm);
      const weight = parseFloat(form.weightKg);
      if (isNaN(height) || isNaN(weight)) return false;
      if (height < 120 || height > 250) return false;
      if (weight < 35 || weight > 230) return false;
    }

    return true;
  }, [form]);

  const result: MacroCalculatorResult | null = useMemo(() => {
    if (!isFormValid || !showResults) return null;

    const heightCm =
      form.unitSystem === 'imperial'
        ? feetInchesToCm(parseInt(form.heightFeet), parseInt(form.heightInches))
        : parseFloat(form.heightCm);

    const weightKg =
      form.unitSystem === 'imperial'
        ? lbsToKg(parseFloat(form.weightLbs))
        : parseFloat(form.weightKg);

    return calculateMacros({
      biologicalSex: form.biologicalSex,
      age: parseInt(form.age),
      heightCm,
      weightKg,
      activityLevel: form.activityLevel,
      goal: form.goal,
      rateOfChange: form.rateOfChange,
    });
  }, [form, isFormValid, showResults]);

  const handleCalculate = () => {
    if (isFormValid) {
      setShowResults(true);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // In production, this would submit to an API
      setEmailSubmitted(true);
    }
  };

  // Prepare macro targets for ChatGPT modal
  const macroTargets = result
    ? {
        dailyCalories: result.targetCalories,
        proteinGrams: result.proteinGrams,
        carbsGrams: result.carbsGrams,
        fatGrams: result.fatGrams,
        goal: result.goal,
      }
    : null;

  // Handle copying project instructions to clipboard
  const handleCopyInstructions = async () => {
    if (!macroTargets) return;
    
    const prompt = generatePrompt(macroTargets);
    
    try {
      await navigator.clipboard.writeText(prompt);
      setInstructionsCopied(true);
      setTimeout(() => setInstructionsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="max-w-4xl mx-auto px-4"
    >
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full mb-4"
        >
          <CalculatorIcon className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">Macro Calculator</span>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Find Your Starting Point
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto mb-4">
          Get a personalized estimate of your daily calorie and macro targets based on your body and goals.
        </p>
        
        {/* How to Set This Up Link - Always Visible */}
        <button
          onClick={chatGPTModal.open}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>How to set this up in ChatGPT</span>
        </button>
      </div>

      {/* Calculator Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Unit System Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              {(['imperial', 'metric'] as UnitSystem[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => updateForm('unitSystem', unit)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    form.unitSystem === unit
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {unit === 'imperial' ? 'Imperial (lbs, ft)' : 'Metric (kg, cm)'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Biological Sex */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biological Sex
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateForm('biologicalSex', 'male')}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      form.biologicalSex === 'male'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <MaleIcon className="w-5 h-5" />
                    <span>Male</span>
                  </button>
                  <button
                    onClick={() => updateForm('biologicalSex', 'female')}
                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      form.biologicalSex === 'female'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <FemaleIcon className="w-5 h-5" />
                    <span>Female</span>
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => updateForm('age', e.target.value)}
                    placeholder="30"
                    min="15"
                    max="100"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    years
                  </span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                {form.unitSystem === 'imperial' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="number"
                        value={form.heightFeet}
                        onChange={(e) => updateForm('heightFeet', e.target.value)}
                        placeholder="5"
                        min="3"
                        max="8"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        ft
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.heightInches}
                        onChange={(e) => updateForm('heightInches', e.target.value)}
                        placeholder="10"
                        min="0"
                        max="11"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        in
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      value={form.heightCm}
                      onChange={(e) => updateForm('heightCm', e.target.value)}
                      placeholder="178"
                      min="120"
                      max="250"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      cm
                    </span>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Weight
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.unitSystem === 'imperial' ? form.weightLbs : form.weightKg}
                    onChange={(e) =>
                      updateForm(
                        form.unitSystem === 'imperial' ? 'weightLbs' : 'weightKg',
                        e.target.value
                      )
                    }
                    placeholder={form.unitSystem === 'imperial' ? '165' : '75'}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {form.unitSystem === 'imperial' ? 'lbs' : 'kg'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Activity & Goals */}
            <div className="space-y-6">
              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <div className="space-y-2">
                  {activityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateForm('activityLevel', option.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        form.activityLevel === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          form.activityLevel === option.value ? 'text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {goalOptions.map((option) => {
                    const IconComponent = option.Icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => updateForm('goal', option.value)}
                        className={`py-3 px-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                          form.goal === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${
                            form.goal === option.value ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            form.goal === option.value ? 'text-blue-700' : 'text-gray-600'
                          }`}
                        >
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rate of Change (only if not maintaining) */}
              <AnimatePresence>
                {form.goal !== 'maintain' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate of Change
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {rateOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateForm('rateOfChange', option.value)}
                          className={`py-3 px-3 rounded-xl border-2 transition-all duration-200 ${
                            form.rateOfChange === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span
                            className={`text-sm font-medium block ${
                              form.rateOfChange === option.value ? 'text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </span>
                          <span className="text-xs text-gray-400">{option.description}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleCalculate}
              disabled={!isFormValid}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Calculate My Macros
            </button>
          </div>

          {/* ChatGPT Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Have ChatGPT Track Your Macros */}
            <button
              onClick={chatGPTModal.open}
              disabled={!result}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                result
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
              <span>Have ChatGPT Track Your Macros</span>
            </button>

            {/* Copy Project Instructions */}
            <button
              onClick={handleCopyInstructions}
              disabled={!result}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                result
                  ? instructionsCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {instructionsCopied ? (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy Project Instructions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white"
            >
              <div className="p-6 sm:p-8">
                {/* Results Header */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your Daily Targets</h3>
                  <p className="text-sm text-gray-500">
                    Estimated starting point based on your inputs
                  </p>
                </div>

                {/* Main Calorie Display */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="inline-flex flex-col items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/30"
                  >
                    <span className="text-5xl font-bold">{result.targetCalories.toLocaleString()}</span>
                    <span className="text-blue-100 text-sm mt-1">calories/day</span>
                  </motion.div>
                </div>

                {/* Macro Breakdown */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
                  {[
                    {
                      label: 'Protein',
                      value: result.proteinGrams,
                      bg: 'bg-orange-50',
                      text: 'text-orange-600',
                    },
                    {
                      label: 'Carbs',
                      value: result.carbsGrams,
                      bg: 'bg-blue-50',
                      text: 'text-blue-600',
                    },
                    {
                      label: 'Fat',
                      value: result.fatGrams,
                      bg: 'bg-purple-50',
                      text: 'text-purple-600',
                    },
                  ].map((macro, index) => (
                    <motion.div
                      key={macro.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`${macro.bg} rounded-2xl p-4 text-center`}
                    >
                      <div className={`text-3xl font-bold ${macro.text}`}>{macro.value}g</div>
                      <div className="text-gray-600 text-sm mt-1">{macro.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Details */}
                <div className="bg-gray-100 rounded-2xl p-4 max-w-lg mx-auto mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">BMR:</span>
                      <span className="text-gray-700 font-medium ml-2">{result.bmr} kcal</span>
                    </div>
                    <div>
                      <span className="text-gray-500">TDEE:</span>
                      <span className="text-gray-700 font-medium ml-2">{result.tdee} kcal</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Goal:</span>
                      <span className="text-gray-700 font-medium ml-2 capitalize">{result.goal}</span>
                    </div>
                    {result.rateOfChange && (
                      <div>
                        <span className="text-gray-500">Rate:</span>
                        <span className="text-gray-700 font-medium ml-2 capitalize">
                          {result.rateOfChange}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guardrails Notice */}
                {result.guardrailsApplied && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-lg mx-auto mb-6"
                  >
                    <div className="flex items-center gap-2 text-amber-800 text-sm text-center justify-center">
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Your target has been adjusted to meet minimum safe calorie thresholds.</span>
                    </div>
                  </motion.div>
                )}

                {/* Disclaimer */}
                <div className="text-center">
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    These are estimated starting points for awareness and reflection — not medical
                    advice or guaranteed results. Adjust based on how you feel and consult a
                    professional for personalized guidance.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Email Signup Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 max-w-xl mx-auto"
      >
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 sm:p-8 border border-emerald-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
              <SparklesIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Save Your Results from ChatGPT
            </h3>
            <p className="text-sm text-gray-600">
              Enter your email to join the waitlist for our free Macro History Saving app.
            </p>
          </div>

          {!emailSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 bg-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <span>Save Macro History</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                  <span>Syncs with ChatGPT</span>
                </div>
                <div className="flex items-center gap-1">
                  <TargetIcon className="w-4 h-4 text-emerald-500" />
                  <span>Free forever</span>
                </div>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-3">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-emerald-700 font-medium">Your macros are saved!</p>
              <p className="text-sm text-gray-600 mt-1">Check your inbox for your personalized macro targets.</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ChatGPT Setup Modal */}
      <ChatGPTSetupModal
        isOpen={chatGPTModal.isOpen}
        onClose={chatGPTModal.close}
        macroTargets={macroTargets}
      />
    </motion.section>
  );
}
