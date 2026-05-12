'use client';

import { useEffect, useRef } from 'react';
import { clearSession } from '@/lib/session';
import { clearProgress } from '@/lib/progress';

interface ClosingProps {
  onPlayAgain: () => void;
  totalScore: number;
}

export default function Closing({ onPlayAgain, totalScore }: ClosingProps) {
  const familiaRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    clearSession();
    clearProgress();
  }, []);

  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      if (familiaRef.current) {
        familiaRef.current.src = `/assets/familia/Loop-Familia_${String(frame).padStart(5, '0')}.png`;
      }
      frame = (frame + 1) % 80;
    }, 41);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .closing-desktop-bg { background-image: none !important; background: linear-gradient(135deg, #2167AE, #1E2D6B) !important; }
          .closing-mobile-layout {
            justify-content: center !important;
            padding-top: 32px !important;
            padding-bottom: 32px !important;
            gap: 20px !important;
          }
          .closing-score { display: flex !important; }
          .closing-familia { display: flex !important; }
        }
        @media (min-width: 641px) {
          .closing-score { display: none; }
          .closing-familia { display: none; }
        }
      `}</style>
      <div
        className="closing-desktop-bg flex flex-col relative overflow-hidden"
        style={{ backgroundImage: 'url(/fin.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}
      >
        <main className="closing-mobile-layout flex-1 flex flex-col items-center justify-end px-4 py-0 pb-4 md:pb-6 relative z-10">

          {/* Score — mobile only */}
          <div className="closing-score flex-col items-center" style={{ display: 'none' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'white', lineHeight: 1 }}>{totalScore}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>/100</div>
              </div>
            </div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>
              {totalScore >= 80 ? '¡Excelente!' : totalScore >= 50 ? '¡Buen trabajo!' : '¡Nivel completado!'}
            </p>
          </div>

          {/* Familia loop animation — mobile only */}
          <div className="closing-familia justify-center" style={{ display: 'none' }}>
            <img
              ref={familiaRef}
              src="/assets/familia/Loop-Familia_00000.png"
              alt=""
              aria-hidden="true"
              style={{ maxHeight: 180, width: 'auto', display: 'block' }}
            />
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold text-white mb-0 md:mb-6 text-center"
            style={{ fontFamily: 'DM Serif Display, Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)', fontSize: 'clamp(22px, 5vw, 48px)' }}
          >
            Gracias por participar!
          </h1>

          <p
            className="text-white text-center leading-relaxed mb-0 md:mb-12"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)', fontSize: 'clamp(15px, 2vw, 20px)', opacity: 0.9 }}
          >
            Juntos construimos comunidades más seguras y resilientes.
          </p>

          <button
            onClick={onPlayAgain}
            className="bg-white text-[#2167AE] px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-[#ECEEEF] transition-colors shadow-lg min-h-[44px]"
            style={{ width: '100%', maxWidth: 280 }}
          >
            Jugar de nuevo
          </button>
        </main>
      </div>
    </>
  );
}
