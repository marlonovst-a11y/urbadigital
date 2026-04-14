'use client';

import { useState } from 'react';
import Header from './Header';
import Ranking from './Ranking';
import { Trophy } from 'lucide-react';

interface LevelMapProps {
  totalScore: number;
  nickname: string;
  participantId: string;
  completedLevels: number[];
  onStartLevel: (level: number) => void;
  onGoToEvaluation?: () => void;
}

const levelData = [
  { number: 1, name: 'Trivia de Prevención', points: 20, character: 'Roberto' },
  { number: 2, name: 'Identifica el Riesgo en la Imagen', points: 20, character: 'Sofía' },
  { number: 3, name: 'Arrastra y Decide', points: 20, character: 'Carmen' },
  { number: 4, name: 'Reto de Respuesta Rápida', points: 20, character: 'Don Manuel' },
  { number: 5, name: 'Crucigrama de Multiamenazas', points: 20, character: 'Con Todos' }
];

export default function LevelMap({ totalScore, nickname, participantId, completedLevels, onStartLevel, onGoToEvaluation }: LevelMapProps) {
  const [isRankingOpen, setIsRankingOpen] = useState(false);

  const getLevelStatus = (levelNum: number) => {
    if (completedLevels.includes(levelNum)) return 'completed';
    if (levelNum === 1 || completedLevels.includes(levelNum - 1)) return 'current';
    return 'locked';
  };

  const levels = levelData.map(level => ({
    ...level,
    status: getLevelStatus(level.number)
  }));

  const allLevelsCompleted = completedLevels.length === 5;

  return (
    <div className="min-h-screen flex flex-col bg-[#ECEEEF]">
      <Header />

      <main className="pt-14 md:pt-24 flex-1 px-3 md:px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-8">
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                <h1 className="text-xl md:text-3xl font-bold text-[#1E2D6B]">
                  Bienvenido, {nickname}
                </h1>
                <button
                  onClick={() => setIsRankingOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-[#2167AE] text-white font-bold rounded-lg hover:bg-[#1E2D6B] transition-colors text-sm md:text-base min-h-[44px]"
                >
                  <Trophy className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                  Ver ranking
                </button>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2167AE] transition-all duration-500"
                    style={{ width: `${Math.min((totalScore / 100) * 100, 100)}%` }}
                  />
                </div>
                <span className="font-bold text-[#2167AE] text-sm md:text-lg whitespace-nowrap">
                  {totalScore}/100 pts
                </span>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {levels.map((level, index) => (
                <div
                  key={level.number}
                  className={`p-3 md:p-6 rounded-lg border-2 transition-all duration-300 ${
                    level.status === 'current'
                      ? 'border-[#2167AE] bg-blue-50'
                      : level.status === 'completed'
                      ? 'border-[#1ABC9C] bg-green-50'
                      : 'border-gray-300 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-6">
                    <div
                      className={`text-xl md:text-4xl font-bold w-10 h-10 md:w-16 md:h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        level.status === 'current'
                          ? 'bg-[#2167AE] text-white'
                          : level.status === 'completed'
                          ? 'bg-[#1ABC9C] text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {level.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-0.5 md:mb-1 leading-tight">
                        {level.name}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-3">
                        Con {level.character}
                      </p>
                      <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-[#2167AE] text-white text-xs md:text-sm font-semibold rounded-full">
                        {level.points} puntos
                      </span>
                    </div>

                    {level.status === 'current' && (
                      <button
                        onClick={() => onStartLevel(level.number)}
                        className="px-4 py-2 md:px-6 md:py-2 bg-[#2167AE] text-white font-bold rounded-lg hover:bg-[#1E2D6B] transition-colors text-sm md:text-base min-h-[44px] flex-shrink-0"
                      >
                        Jugar
                      </button>
                    )}

                    {level.status === 'locked' && (
                      <div className="text-gray-400 text-xs md:text-sm font-semibold flex-shrink-0">
                        Bloqueado
                      </div>
                    )}

                    {level.status === 'completed' && (
                      <div className="text-[#1ABC9C] text-xs md:text-sm font-bold flex-shrink-0">
                        Completado
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {allLevelsCompleted && onGoToEvaluation && (
              <div className="mt-6 md:mt-8 bg-[#1ABC9C] rounded-lg p-4 md:p-6 text-center">
                <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3">
                  ¡Felicidades! Completaste todos los niveles
                </h3>
                <p className="text-white mb-3 md:mb-4 text-sm md:text-base">
                  Continúa a la evaluación final para desbloquear 10 puntos adicionales
                </p>
                <button
                  onClick={onGoToEvaluation}
                  className="px-6 py-3 md:px-8 md:py-3 bg-white text-[#1ABC9C] font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base min-h-[44px]"
                >
                  Ir a Evaluación Final
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Ranking
        isOpen={isRankingOpen}
        onClose={() => setIsRankingOpen(false)}
        participantId={participantId}
      />
    </div>
  );
}
