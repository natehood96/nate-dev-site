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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Back navigation */}
      <div className="fixed top-24 left-4 z-40">
        <Link
          href="/"
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md"
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
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {children}
    </motion.div>
  );
}
