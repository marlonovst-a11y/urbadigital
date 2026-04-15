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

const levelPositions = [
  { left: '14%', top: '58%' },
  { left: '31%', top: '58%' },
  { left: '48%', top: '58%' },
  { left: '65%', top: '58%' },
  { left: '82%', top: '58%' },
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
        backgroundImage: 'url(/retos.png)',
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

      {[1, 2, 3, 4, 5].map((num) => {
        const status = getLevelStatus(num);
        const pos = levelPositions[num - 1];
        const isLocked = status === 'locked';
        const isCompleted = status === 'completed';

        return (
          <button
            key={num}
            onClick={() => !isLocked && onStartLevel(num)}
            style={{
              position: 'absolute',
              left: pos.left,
              top: pos.top,
              transform: 'translate(-50%, -50%)',
              width: 'clamp(90px, 11vw, 140px)',
              height: 'clamp(90px, 11vw, 140px)',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              opacity: isLocked ? 0.45 : 1,
              transition: 'transform 0.15s ease, opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isLocked) (e.currentTarget as HTMLButtonElement).style.transform = 'translate(-50%, -50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translate(-50%, -50%) scale(1)';
            }}
            aria-label={`Nivel ${num}`}
          >
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
        );
      })}

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
