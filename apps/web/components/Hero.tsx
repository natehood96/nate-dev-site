'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@nate/ui';
import { FloatingProjectCard, type Project } from './FloatingProjectCard';

const projects: Project[] = [
  {
    id: 'macro-tracker',
    title: 'Macro Tracker',
    description: 'Track your daily nutrition with ease',
    href: '/macro-tracker',
    icon: '🥗',
    badge: 'Active',
    badgeVariant: 'success',
    gradient: 'bg-gradient-to-br from-green-50/50 to-emerald-100/30',
  },
  {
    id: 'project-2',
    title: 'AI Assistant',
    description: 'Intelligent automation for your workflow',
    icon: '🤖',
    badge: 'Coming Soon',
    badgeVariant: 'default',
    gradient: 'bg-gradient-to-br from-blue-50/50 to-indigo-100/30',
    comingSoon: true,
  },
  {
    id: 'project-3',
    title: 'Finance Hub',
    description: 'Smart budgeting and expense tracking',
    icon: '💰',
    badge: 'Coming Soon',
    badgeVariant: 'default',
    gradient: 'bg-gradient-to-br from-amber-50/50 to-yellow-100/30',
    comingSoon: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-2xl" />
        {/* Ambient light behind the portrait */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-white/70 to-transparent rounded-full"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* DEAD CENTER - Nate's photo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10"
        >
          {/* Decorative rings behind image */}
          <motion.div
            className="absolute -inset-6 rounded-full border border-primary/10"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -inset-12 rounded-full border border-primary/5"
            animate={{
              scale: [1, 1.03, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
          
          {/* Image - 1.3x bigger */}
          <div className="relative w-[26rem] h-[34rem] sm:w-[32rem] sm:h-[42rem] lg:w-[36rem] lg:h-[50rem]">
            <Image
              src="/images/nate.png"
              alt="Nate"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </motion.div>
      </div>

      <Container className="relative z-20 h-screen flex items-center">
        <div className="w-full flex justify-between items-center">
          
          {/* Left side - Text content (overlaps into center) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center max-w-xs sm:max-w-sm lg:max-w-md"
          >
            <motion.span
              variants={itemVariants}
              className="text-text-secondary text-lg mb-4"
            >
              Hello, I&apos;m
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6"
            >
              <span className="text-text-primary">NATE</span>
              <span className="text-primary">.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-text-secondary max-w-xs sm:max-w-sm leading-relaxed mb-8"
            >
              Founder & builder exploring ideas and shipping MVPs. 
              I love turning concepts into products that solve real problems 
              and make people&apos;s lives a little bit better.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6"
            >
              {/* Social links */}
              <a
                href="mailto:itsmenatehood@gmail.com"
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">itsmenatehood@gmail.com</span>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Right side - Floating projects (overlaps into center) */}
          <div className="relative hidden md:flex flex-col gap-6 items-end">
            <FloatingProjectCard
              project={projects[0]}
              index={0}
              className="relative z-30"
            />
            
            <FloatingProjectCard
              project={projects[1]}
              index={1}
              className="relative z-30 -mr-8"
            />
            
            <FloatingProjectCard
              project={projects[2]}
              index={2}
              className="relative z-30"
            />
          </div>
        </div>
      </Container>

      {/* Decorative floating elements */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="absolute top-32 left-[15%] w-14 h-14 rounded-2xl bg-primary/10 backdrop-blur-sm hidden lg:block z-30"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-32 left-[20%] w-10 h-10 rounded-full bg-green-100/80 backdrop-blur-sm hidden lg:block z-30"
      />
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-48 right-[15%] w-6 h-6 rounded-lg bg-amber-100/80 backdrop-blur-sm hidden lg:block z-30"
      />
      <motion.div
        animate={{ 
          y: [0, 12, 0],
          x: [0, -8, 0],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 0.5,
        }}
        className="absolute bottom-40 right-[25%] w-8 h-8 rounded-full bg-blue-100/80 backdrop-blur-sm hidden lg:block z-30"
      />
    </section>
  );
}
