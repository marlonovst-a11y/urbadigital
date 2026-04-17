import { useCallback } from 'react';

export function useSound() {
  const play = useCallback((sound: 'correct' | 'wrong' | 'found' | 'complete' | 'timeup' | 'click') => {
    try {
      const ext = sound === 'timeup' ? 'mp3' : 'wav';
      const audio = new Audio(`/sound-${sound}.${ext}`);
      audio.volume = 0.5;
      audio.load();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch(e) {
      console.log('Sound error:', e);
    }
  }, []);
  return { play };
}
