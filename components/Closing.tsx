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

  const scoreLabel = totalScore >= 80 ? '¡Excelente!' : totalScore >= 50 ? '¡Buen trabajo!' : '¡Nivel completado!';

  return (
    <div className="closing-root flex flex-col relative overflow-hidden" style={{ minHeight: '100vh' }}>
      <style>{`
        /* Desktop: illustrated background, content anchored to bottom */
        .closing-root {
          background-image: url(/fin.png);
          background-size: cover;
          background-position: center;
        }
        .closing-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 0 16px 24px;
          position: relative;
          z-index: 10;
        }
        .closing-score-block  { display: none; }
        .closing-familia-block { display: none; }
        .closing-title { font-size: clamp(30px, 5vw, 48px); margin-bottom: 24px; }
        .closing-subtitle { font-size: clamp(16px, 2vw, 20px); margin-bottom: 48px; }
        .closing-btn { width: auto; max-width: none; padding: 12px 32px; }

        /* Mobile: gradient, centered column, all elements visible */
        @media (max-width: 640px) {
          .closing-root {
            background-image: none;
            background: linear-gradient(135deg, #2167AE, #1E2D6B);
          }
          .closing-main {
            justify-content: center;
            padding: 40px 24px 40px;
            gap: 20px;
          }
          .closing-score-block  { display: flex; flex-direction: column; align-items: center; gap: 6px; }
          .closing-familia-block { display: flex; justify-content: center; }
          .closing-title { font-size: 22px; margin-bottom: 0; }
          .closing-subtitle { font-size: 15px; margin-bottom: 0; opacity: 0.9; }
          .closing-btn { width: 100%; max-width: 280px; padding: 14px 0; }
        }
      `}</style>

      <main className="closing-main">
        {/* 1. Score / label */}
        <div className="closing-score-block">
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'white', lineHeight: 1 }}>{totalScore}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>/100</div>
            </div>
          </div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0 }}>{scoreLabel}</p>
        </div>

        {/* 2. Familia animation */}
        <div className="closing-familia-block">
          <img
            ref={familiaRef}
            src="/assets/familia/Loop-Familia_00000.png"
            alt=""
            aria-hidden="true"
            style={{ maxHeight: 180, width: 'auto', display: 'block' }}
          />
        </div>

        {/* 3. Title */}
        <h1
          className="closing-title font-bold text-white text-center"
          style={{ fontFamily: 'DM Serif Display, Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        >
          Gracias por participar!
        </h1>

        {/* 4. Subtitle */}
        <p className="closing-subtitle text-white text-center leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          Juntos construimos comunidades más seguras y resilientes.
        </p>

        {/* 5. Button */}
        <button
          onClick={onPlayAgain}
          className="closing-btn bg-white text-[#2167AE] rounded-lg font-bold text-base md:text-lg hover:bg-[#ECEEEF] transition-colors shadow-lg min-h-[44px]"
        >
          Jugar de nuevo
        </button>
      </main>
    </div>
  );
}
