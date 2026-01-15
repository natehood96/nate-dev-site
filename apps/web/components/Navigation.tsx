'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Container } from '@nate/ui';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
];

export function Navigation() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-100/50"
    >
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-bold text-text-primary"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              nate<span className="text-primary">.</span>
            </motion.span>
          </Link>

          {/* Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button variant="primary" size="md">
            Let&apos;s Talk
          </Button>
        </nav>
      </Container>
    </motion.header>
  );
}
