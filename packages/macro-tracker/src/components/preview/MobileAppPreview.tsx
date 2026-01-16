'use client';

import { motion } from 'framer-motion';
import { PhoneMockup } from './PhoneMockup';
import { DailySummaryCard } from './DailySummaryCard';
import { MacroDonutChart } from './MacroDonutChart';
import { MealTimeline } from './MealTimeline';
import { TrendsCard } from './TrendsCard';
import { MacroCalculatorSection } from './MacroCalculatorSection';
import {
  ChatIcon,
  BookOpenIcon,
  BellOffIcon,
  ChartBarIcon,
  FeatherIcon,
  HeartIcon,
  TodayIcon,
  TrendsIcon,
  HistoryIcon,
  SettingsIcon,
} from './Icons';

const howItWorksFeatures = [
  {
    Icon: ChatIcon,
    title: 'Chat to Log',
    description: 'Tell ChatGPT what you ate — photos welcome. AI handles the rest.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    Icon: BookOpenIcon,
    title: 'Your Food Journal',
    description: "A calm, read-only view of everything you've eaten. No data entry here.",
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    Icon: BellOffIcon,
    title: 'Zero Notifications',
    description: 'No reminders. No nudges. No guilt. Check in when you want to.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    Icon: ChartBarIcon,
    title: 'Spot Patterns',
    description: 'See trends and history over time. Notice what works for you.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    Icon: FeatherIcon,
    title: 'Effortless Tracking',
    description: 'Conversation is the interface. Just talk about your meals naturally.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    Icon: HeartIcon,
    title: 'Built for Real Life',
    description: 'Flexible, forgiving, and designed for how you actually eat.',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
];

const tabBarItems = [
  { Icon: TodayIcon, label: 'Today', active: true },
  { Icon: TrendsIcon, label: 'Trends', active: false },
  { Icon: HistoryIcon, label: 'History', active: false },
  { Icon: SettingsIcon, label: 'Settings', active: false },
];

export function MobileAppPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 py-12 sm:py-20 overflow-hidden">
      {/* Macro Calculator Section - FIRST */}
      <MacroCalculatorSection />

      {/* Spacer */}
      <div className="h-16 sm:h-24" />

      {/* Mobile App Preview Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-12 sm:mb-16">
        {/* Coming Soon Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium text-blue-700">Mobile App Coming Soon</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight"
        >
          Your Macros,{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Reimagined
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8"
        >
          Log meals by chatting with AI. View your history here. No friction, no guilt, no nagging.
        </motion.p>

        {/* Preview Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500"
        >
          This is a preview of the upcoming mobile experience
        </motion.p>
      </div>

      {/* Phone Mockup with App Preview */}
      <PhoneMockup>
        {/* App Header Bar */}
        <div className="bg-white px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </h2>
              <h1 className="text-[20px] font-bold text-gray-900">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              N
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="space-y-4 py-4 pb-8">
          <DailySummaryCard />
          <MacroDonutChart />
          <MealTimeline />
          <TrendsCard />
        </div>

        {/* Bottom Tab Bar */}
        <div className="absolute bottom-8 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <div className="flex items-center justify-around py-3">
            {tabBarItems.map((tab) => {
              const IconComponent = tab.Icon;
              return (
                <div
                  key={tab.label}
                  className="flex flex-col items-center gap-0.5"
                >
                  <IconComponent
                    className={`w-5 h-5 ${tab.active ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      tab.active ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </PhoneMockup>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-4xl mx-auto px-4 mt-16 sm:mt-24"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4">
          How It Works
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
          ChatGPT handles the logging. This app is your personal food journal — a calm, read-only view of your history.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {howItWorksFeatures.map((feature, index) => {
            const IconComponent = feature.Icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4`}>
                  <IconComponent className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-xl mx-auto px-4 mt-16 sm:mt-24 text-center"
      >
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-blue-500/20">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">Get Early Access</h3>
          <p className="text-blue-100 mb-6">
            Be the first to know when the app launches. No spam, just the good stuff.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              disabled
            />
            <button
              className="px-6 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors disabled:opacity-70"
              disabled
            >
              Notify Me
            </button>
          </div>
          <p className="text-xs text-blue-200 mt-4">
            Email notifications coming soon
          </p>
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center text-sm text-gray-400 mt-16 px-4"
      >
        Designed with care. Built for people who want to feel great.
      </motion.p>
    </div>
  );
}
