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

      <main className="pt-24 flex-1 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-[#1E2D6B]">
                  Bienvenido, {nickname}
                </h1>
                <button
                  onClick={() => setIsRankingOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2167AE] text-white font-bold rounded-lg hover:bg-[#1E2D6B] transition-colors"
                >
                  <Trophy className="w-5 h-5" fill="currentColor" />
                  Ver ranking
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2167AE] transition-all duration-500"
                    style={{ width: `${Math.min((totalScore / 100) * 100, 100)}%` }}
                  />
                </div>
                <span className="font-bold text-[#2167AE] text-lg">
                  {totalScore}/100 puntos
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {levels.map((level, index) => (
                <div
                  key={level.number}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    level.status === 'current'
                      ? 'border-[#2167AE] bg-blue-50'
                      : level.status === 'completed'
                      ? 'border-[#1ABC9C] bg-green-50'
                      : 'border-gray-300 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`text-4xl font-bold w-16 h-16 rounded-lg flex items-center justify-center ${
                        level.status === 'current'
                          ? 'bg-[#2167AE] text-white'
                          : level.status === 'completed'
                          ? 'bg-[#1ABC9C] text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {level.number}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {level.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        Con {level.character}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-[#2167AE] text-white text-sm font-semibold rounded-full">
                          {level.points} puntos
                        </span>
                      </div>
                    </div>

                    {level.status === 'current' && (
                      <button
                        onClick={() => onStartLevel(level.number)}
                        className="px-6 py-2 bg-[#2167AE] text-white font-bold rounded-lg hover:bg-[#1E2D6B] transition-colors"
                      >
                        Jugar
                      </button>
                    )}

                    {level.status === 'locked' && (
                      <div className="text-gray-400 text-sm font-semibold">
                        Bloqueado
                      </div>
                    )}

                    {level.status === 'completed' && (
                      <div className="text-[#1ABC9C] text-sm font-bold">
                        Completado
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {allLevelsCompleted && onGoToEvaluation && (
              <div className="mt-8 bg-[#1ABC9C] rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-3">
                  ¡Felicidades! Completaste todos los niveles
                </h3>
                <p className="text-white mb-4">
                  Continúa a la evaluación final para desbloquear 10 puntos adicionales
                </p>
                <button
                  onClick={onGoToEvaluation}
                  className="px-8 py-3 bg-white text-[#1ABC9C] font-bold rounded-lg hover:bg-gray-100 transition-colors"
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
