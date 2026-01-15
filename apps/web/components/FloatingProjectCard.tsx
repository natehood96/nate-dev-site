'use client';

import Link from 'next/link';
import { motion, useAnimationControls } from 'framer-motion';
import { Card, Badge } from '@nate/ui';
import { useEffect, useMemo } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  href?: string;
  icon: string;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning';
  gradient: string;
  comingSoon?: boolean;
}

interface FloatingProjectCardProps {
  project: Project;
  index: number;
  style?: React.CSSProperties;
  className?: string;
}

export function FloatingProjectCard({ project, index, style, className }: FloatingProjectCardProps) {
  // Generate unique floating animation parameters for each card
  const floatParams = useMemo(() => ({
    yAmplitude: 8 + Math.random() * 12,
    xAmplitude: 4 + Math.random() * 8,
    rotateAmplitude: 2 + Math.random() * 3,
    duration: 5 + Math.random() * 3,
    delay: index * 0.5,
  }), [index]);

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        delay: 0.3 + index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={style}
      className={className}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{
          y: [0, -floatParams.yAmplitude, 0, floatParams.yAmplitude * 0.5, 0],
          x: [0, floatParams.xAmplitude, 0, -floatParams.xAmplitude * 0.5, 0],
          rotate: [0, floatParams.rotateAmplitude, 0, -floatParams.rotateAmplitude * 0.7, 0],
        }}
        transition={{
          duration: floatParams.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: floatParams.delay,
        }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
      >
        <Card
          variant="glass"
          hoverable={!project.comingSoon}
          className={`p-5 w-56 relative overflow-hidden group ${project.comingSoon ? 'cursor-default' : ''}`}
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${project.gradient}`}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <span className="text-xl">{project.icon}</span>
            </div>

            {/* Badge */}
            {project.badge && (
              <Badge variant={project.badgeVariant} className="mb-2 text-xs">
                {project.badge}
              </Badge>
            )}

            {/* Title */}
            <h3 className={`text-base font-semibold mb-1.5 ${project.comingSoon ? 'text-text-secondary' : 'text-text-primary group-hover:text-primary'} transition-colors duration-300`}>
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-text-secondary leading-relaxed">
              {project.description}
            </p>

            {/* Arrow indicator - only show for active projects */}
            {!project.comingSoon && (
              <motion.div
                className="absolute bottom-5 right-5 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <svg
                  className="w-3.5 h-3.5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );

  if (project.comingSoon || !project.href) {
    return content;
  }

  return <Link href={project.href}>{content}</Link>;
}
