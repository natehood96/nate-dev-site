'use client';

import { useEffect, useState, useCallback } from 'react';

interface KeyState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
  escape: boolean;
}

const initialKeyState: KeyState = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
  escape: false,
};

export function useKeyboardControls() {
  const [keys, setKeys] = useState<KeyState>(initialKeyState);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        setKeys(prev => ({ ...prev, up: true }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setKeys(prev => ({ ...prev, down: true }));
        break;
      case 'ArrowLeft':
      case 'KeyA':
        setKeys(prev => ({ ...prev, left: true }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setKeys(prev => ({ ...prev, right: true }));
        break;
      case 'Space':
        setKeys(prev => ({ ...prev, space: true }));
        break;
      case 'Escape':
        setKeys(prev => ({ ...prev, escape: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        setKeys(prev => ({ ...prev, up: false }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setKeys(prev => ({ ...prev, down: false }));
        break;
      case 'ArrowLeft':
      case 'KeyA':
        setKeys(prev => ({ ...prev, left: false }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setKeys(prev => ({ ...prev, right: false }));
        break;
      case 'Space':
        setKeys(prev => ({ ...prev, space: false }));
        break;
      case 'Escape':
        setKeys(prev => ({ ...prev, escape: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keys;
}
