'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, Badge } from '@nate/ui';

export interface Project {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning';
  gradient: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  style?: React.CSSProperties;
  className?: string;
}

export function ProjectCard({ project, index, style, className }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.3 + index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ 
        scale: 1.05,
        y: -8,
        transition: { duration: 0.2 }
      }}
      style={style}
      className={className}
    >
      <Link href={project.href}>
        <Card
          variant="glass"
          hoverable
          className="p-6 w-64 relative overflow-hidden group"
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${project.gradient}`}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
              <span className="text-2xl">{project.icon}</span>
            </div>

            {/* Badge */}
            {project.badge && (
              <Badge variant={project.badgeVariant} className="mb-3">
                {project.badge}
              </Badge>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-text-secondary leading-relaxed">
              {project.description}
            </p>

            {/* Arrow indicator */}
            <motion.div
              className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <svg
                className="w-4 h-4 text-primary"
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
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
