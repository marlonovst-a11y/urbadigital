'use client';

import { useState } from 'react';
import Ranking from './Ranking';
import Header from './Header';
import { Trophy, CircleCheck as CheckCircle } from 'lucide-react';

interface LevelMapProps {
  totalScore: number;
  nickname: string;
  participantId: string;
  completedLevels: number[];
  onStartLevel: (level: number) => void;
  onGoToEvaluation?: () => void;
}

const levelNames = [
  'Trivia de Prevención',
  'Identifica el Riesgo',
  'Arrastra y Decide',
  'Reto Ambiental',
  'Crucigrama',
];

export default function LevelMap({ totalScore, nickname, participantId, completedLevels, onStartLevel, onGoToEvaluation }: LevelMapProps) {
  const [isRankingOpen, setIsRankingOpen] = useState(false);

  const getLevelStatus = (levelNum: number) => {
    if (completedLevels.includes(levelNum)) return 'completed';
    if (levelNum === 1 || completedLevels.includes(levelNum - 1)) return 'current';
    return 'locked';
  };

  const allLevelsCompleted = completedLevels.length === 5;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/retos_fondo.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Header />

      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '12px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            background: 'rgba(33, 103, 174, 0.85)',
            borderRadius: '20px',
            padding: '4px 12px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '13px',
            backdropFilter: 'blur(4px)',
          }}
        >
          {totalScore}/100 pts
        </div>
        <button
          onClick={() => setIsRankingOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(33, 103, 174, 0.85)',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 14px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            minHeight: '36px',
          }}
        >
          <Trophy style={{ width: '16px', height: '16px' }} />
          Ranking
        </button>
      </div>

      <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 16, zIndex: 10 }}>
        <img src="/roberto_retos.png" style={{ width: 'clamp(80px, 10vw, 130px)', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
        <div style={{ background: 'white', borderRadius: 16, padding: 'clamp(12px, 2vw, 20px) clamp(16px, 2.5vw, 32px)', maxWidth: 'clamp(260px, 40vw, 512px)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', position: 'relative', border: '3px solid #1a4f8a' }}>
          <div style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '12px solid white' }} />
          <p style={{ margin: 0, color: '#1E2D6B', fontWeight: 700, fontSize: 'clamp(16px, 1.8vw, 22px)', lineHeight: 1.4, fontFamily: "'Zurich_Light_Condensed_BT', sans-serif" }}>
            ¡Bienvenido a Aprende y Previene! Completa los 5 niveles y conviértete en experto en prevención de riesgos.
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 'clamp(12px, 3vw, 40px)', alignItems: 'flex-start', zIndex: 10 }}>
        {[1, 2, 3, 4, 5].map((num) => {
          const status = getLevelStatus(num);
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';

          return (
            <div key={num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => !isLocked && onStartLevel(num)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'clamp(70px, 9vw, 120px)',
                  height: 'clamp(70px, 9vw, 120px)',
                  borderRadius: '50%',
                  background: isCompleted
                    ? 'radial-gradient(circle at 35% 35%, #f5c842, #d4a017)'
                    : isLocked
                    ? 'radial-gradient(circle at 35% 35%, #9eb3c8, #6a8aa3)'
                    : 'radial-gradient(circle at 35% 35%, #f5c842, #d4a017)',
                  border: '5px solid white',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  opacity: isLocked ? 0.5 : 1,
                  transition: 'transform 0.15s ease, opacity 0.2s',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
                  position: 'relative',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isLocked) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
                aria-label={`Nivel ${num}`}
              >
                <span style={{
                  color: isLocked ? '#fff' : '#5C3A1E',
                  fontWeight: 900,
                  fontSize: 'clamp(36px, 5vw, 60px)',
                  lineHeight: 1,
                  textShadow: isLocked ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                  fontFamily: 'RobotRadicals, sans-serif',
                }}>
                  {num}
                </span>
                {isCompleted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: 'clamp(20px, 2.5vw, 32px)',
                      height: 'clamp(20px, 2.5vw, 32px)',
                      borderRadius: '50%',
                      background: '#1ABC9C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      zIndex: 11,
                    }}
                  >
                    <CheckCircle style={{ width: '70%', height: '70%', color: '#fff' }} />
                  </div>
                )}
              </button>
              <span style={{
                color: 'white',
                fontWeight: 700,
                fontSize: 'clamp(22px, 2.6vw, 28px)',
                textAlign: 'center',
                maxWidth: 'clamp(70px, 9vw, 120px)',
                lineHeight: 1.1,
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                fontFamily: 'UniversCondensedBold, sans-serif',
              }}>
                {levelNames[num - 1]}
              </span>
            </div>
          );
        })}
      </div>

      {allLevelsCompleted && onGoToEvaluation && (
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            textAlign: 'center',
          }}
        >
          <button
            onClick={onGoToEvaluation}
            style={{
              background: '#1ABC9C',
              color: '#fff',
              fontWeight: 800,
              fontSize: 'clamp(14px, 1.6vw, 18px)',
              padding: '12px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              minHeight: '48px',
              letterSpacing: '0.02em',
            }}
          >
            Ir a Evaluación Final
          </button>
        </div>
      )}

      <Ranking
        isOpen={isRankingOpen}
        onClose={() => setIsRankingOpen(false)}
        participantId={participantId}
      />
    </div>
  );
}
