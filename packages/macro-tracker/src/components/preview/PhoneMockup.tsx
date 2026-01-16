'use client';

import { motion } from 'framer-motion';
import { cn } from '@nate/ui';

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative mx-auto', className)}
    >
      {/* Phone frame - iPhone 15 Pro inspired */}
      <div className="relative w-[320px] sm:w-[375px] mx-auto">
        {/* Outer frame with titanium-like finish */}
        <div className="relative bg-gradient-to-b from-[#3a3a3c] via-[#2c2c2e] to-[#1c1c1e] rounded-[50px] p-[12px] shadow-2xl">
          {/* Inner bezel */}
          <div className="relative bg-gradient-to-b from-[#1c1c1e] to-[#0a0a0a] rounded-[40px] p-[3px]">
            {/* Screen container */}
            <div className="relative bg-black rounded-[38px] overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-3">
                <div className="w-[120px] h-[34px] bg-black rounded-full flex items-center justify-center gap-2">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#1c1c1e] ring-1 ring-[#2c2c2e]" />
                </div>
              </div>
              
              {/* Status bar */}
              <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-8 pt-[14px] text-white text-xs font-medium">
                <span className="w-12">9:41</span>
                <span className="w-12" />
                <div className="w-12 flex items-center justify-end gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C8.5 3 5.5 4.6 3.5 7L12 18l8.5-11C18.5 4.6 15.5 3 12 3z" opacity="0.3"/>
                    <path d="M12 5C9.3 5 6.9 6.2 5.3 8l6.7 8.7L18.7 8C17.1 6.2 14.7 5 12 5z"/>
                  </svg>
                  <svg className="w-6 h-3" viewBox="0 0 28 14" fill="currentColor">
                    <rect x="0" y="0" width="24" height="14" rx="3" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
                    <rect x="2" y="2" width="18" height="10" rx="1.5" fill="currentColor"/>
                    <rect x="25" y="4" width="2" height="6" rx="1" fill="currentColor" opacity="0.4"/>
                  </svg>
                </div>
              </div>

              {/* Screen content */}
              <div className="relative min-h-[650px] sm:min-h-[750px] bg-[#f5f5f7] pt-12 overflow-hidden">
                {children}
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center pb-1">
                <div className="w-32 h-1 bg-black/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle reflection/shine effect */}
        <div className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Side buttons - Volume */}
        <div className="absolute left-[-2px] top-[120px] w-[3px] h-[30px] bg-gradient-to-r from-[#2c2c2e] to-[#3a3a3c] rounded-l-sm" />
        <div className="absolute left-[-2px] top-[160px] w-[3px] h-[55px] bg-gradient-to-r from-[#2c2c2e] to-[#3a3a3c] rounded-l-sm" />
        <div className="absolute left-[-2px] top-[225px] w-[3px] h-[55px] bg-gradient-to-r from-[#2c2c2e] to-[#3a3a3c] rounded-l-sm" />
        
        {/* Side button - Power */}
        <div className="absolute right-[-2px] top-[180px] w-[3px] h-[80px] bg-gradient-to-l from-[#2c2c2e] to-[#3a3a3c] rounded-r-sm" />
      </div>
    </motion.div>
  );
}
