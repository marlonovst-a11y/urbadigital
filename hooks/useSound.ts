import { useCallback } from 'react';

export function useSound() {
  const play = useCallback((sound: 'correct' | 'wrong' | 'found' | 'complete' | 'timeup' | 'click') => {
    try {
      const ext = sound === 'timeup' ? 'mp3' : 'wav';
      const audio = new Audio(`/sound-${sound}.${ext}`);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch(e) {}
  }, []);
  return { play };
}
