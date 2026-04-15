'use client';

import { useEffect } from 'react';
import DecorativeShapes from './DecorativeShapes';
import { clearSession } from '@/lib/session';
import { clearProgress } from '@/lib/progress';

interface ClosingProps {
  onPlayAgain: () => void;
  totalScore: number;
}

export default function Closing({ onPlayAgain, totalScore }: ClosingProps) {
  useEffect(() => {
    clearSession();
    clearProgress();
  }, []);

  return (
    <div
      className="flex flex-col relative overflow-hidden"
      style={{ backgroundImage: 'url(/fin.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}
    >
      <main className="flex-1 flex flex-col items-center justify-end px-4 py-0 pb-4 md:pb-6 relative z-10">
        <h1
          className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 text-center"
          style={{ fontFamily: 'DM Serif Display, Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        >
          Gracias por participar!
        </h1>

        <p
          className="text-base md:text-xl text-white mb-8 md:mb-12 leading-relaxed text-center"
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        >
          Juntos construimos comunidades más seguras y resilientes.
        </p>

        <button
          onClick={onPlayAgain}
          className="bg-white text-[#2167AE] px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-[#ECEEEF] transition-colors shadow-lg min-h-[44px]"
        >
          Jugar de nuevo
        </button>
      </main>
    </div>
  );
}
