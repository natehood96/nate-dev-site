'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MacroTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Back navigation - positioned to complement the preview design */}
      <div className="fixed top-4 sm:top-6 left-4 sm:left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full shadow-md hover:shadow-lg border border-gray-100"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      {children}
    </motion.div>
  );
}
