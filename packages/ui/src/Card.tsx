'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from './utils/cn';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'default' | 'glass';
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, children, ...props }, ref) => {
    const baseStyles =
      'rounded-2xl transition-all duration-300';

    const variantStyles = {
      default: 'bg-card-bg shadow-card',
      glass: 'bg-white/70 backdrop-blur-glass shadow-glass border border-white/20',
    };

    const hoverStyles = hoverable
      ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer'
      : '';

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
