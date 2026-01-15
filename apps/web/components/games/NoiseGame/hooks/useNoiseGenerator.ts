'use client';

import { useCallback, useRef } from 'react';

// Simple 2D noise generation (Perlin-like)
export function useNoiseGenerator(seed: number = 42) {
  const permRef = useRef<number[]>([]);

  // Initialize permutation table
  if (permRef.current.length === 0) {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    // Shuffle based on seed
    let random = seed;
    for (let i = 255; i > 0; i--) {
      random = (random * 16807) % 2147483647;
      const j = random % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    permRef.current = [...p, ...p];
  }

  const fade = useCallback((t: number) => t * t * t * (t * (t * 6 - 15) + 10), []);
  
  const lerp = useCallback((a: number, b: number, t: number) => a + t * (b - a), []);

  const grad = useCallback((hash: number, x: number, y: number) => {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2.0 * v : 2.0 * v);
  }, []);

  const noise2D = useCallback((x: number, y: number): number => {
    const perm = permRef.current;
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = fade(x);
    const v = fade(y);
    
    const A = perm[X] + Y;
    const B = perm[X + 1] + Y;
    
    return lerp(
      lerp(grad(perm[A], x, y), grad(perm[B], x - 1, y), u),
      lerp(grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1), u),
      v
    );
  }, [fade, lerp, grad]);

  return { noise2D };
}
