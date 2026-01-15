'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface GameLoopState {
  isRunning: boolean;
  fps: number;
  deltaTime: number;
}

export function useGameLoop(onUpdate?: (deltaTime: number) => void) {
  const [state, setState] = useState<GameLoopState>({
    isRunning: false,
    fps: 0,
    deltaTime: 0,
  });
  
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const fpsCounterRef = useRef<number[]>([]);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const stop = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  useEffect(() => {
    if (!state.isRunning) return;

    const loop = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Calculate FPS
      fpsCounterRef.current.push(deltaTime);
      if (fpsCounterRef.current.length > 60) {
        fpsCounterRef.current.shift();
      }
      const avgDelta = fpsCounterRef.current.reduce((a, b) => a + b, 0) / fpsCounterRef.current.length;
      const fps = Math.round(1000 / avgDelta);

      setState(prev => ({ ...prev, fps, deltaTime }));
      onUpdate?.(deltaTime);

      frameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [state.isRunning, onUpdate]);

  return { ...state, start, stop };
}
