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
    <div className="min-h-screen flex flex-col bg-[#2167AE] relative overflow-hidden">
      <DecorativeShapes />

      <header className="w-full bg-[#1E2D6B] py-4 px-6 shadow-md relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E2D6B] font-bold text-xl">Z</span>
            </div>
            <span className="text-white font-bold text-lg">ZURICH</span>
          </div>

          <div className="w-px h-8 bg-white/30" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-[#1E2D6B] font-bold text-xs">PI</span>
            </div>
            <span className="text-white font-semibold text-sm">Plan International</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: 'DM Serif Display, Georgia, serif' }}>
            Gracias por participar!
          </h1>

          <p className="text-xl text-white mb-12 leading-relaxed">
            Juntos construimos comunidades más seguras y resilientes.
          </p>

          <div className="flex justify-center mb-12">
            <img src="/personajes.svg" alt="Familia completa" style={{ width: '300px' }} />
          </div>

          <button
            onClick={onPlayAgain}
            className="bg-white text-[#2167AE] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#ECEEEF] transition-colors shadow-lg"
          >
            Jugar de nuevo
          </button>
        </div>
      </main>

      <footer className="w-full bg-[#1E2D6B] py-6 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E2D6B] font-bold text-lg">Z</span>
            </div>
            <span className="text-white font-bold">ZURICH</span>
          </div>

          <div className="w-px h-6 bg-white/30" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
              <span className="text-[#1E2D6B] font-bold text-xs">PI</span>
            </div>
            <span className="text-white font-semibold text-sm">Plan International</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
