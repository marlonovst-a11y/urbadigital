'use client';

import { useEffect, useState } from 'react';
import { X, Trophy, Medal, Award } from 'lucide-react';
import { getTopRanking, getParticipantRanking, RankingEntry, getParticipant } from '@/lib/supabase';

interface RankingProps {
  isOpen: boolean;
  onClose: () => void;
  participantId: string | null;
}

const demoData: RankingEntry[] = [
  { id: '1', nickname: 'María G.', puntaje_total: 105, position: 1 },
  { id: '2', nickname: 'Carlos R.', puntaje_total: 98, position: 2 },
  { id: '3', nickname: 'Ana L.', puntaje_total: 92, position: 3 },
  { id: '4', nickname: 'Pedro M.', puntaje_total: 88, position: 4 },
  { id: '5', nickname: 'Laura S.', puntaje_total: 85, position: 5 },
  { id: '6', nickname: 'Diego T.', puntaje_total: 82, position: 6 },
  { id: '7', nickname: 'Sofía P.', puntaje_total: 78, position: 7 },
  { id: '8', nickname: 'Juan C.', puntaje_total: 75, position: 8 },
  { id: '9', nickname: 'Camila V.', puntaje_total: 72, position: 9 },
  { id: '10', nickname: 'Roberto H.', puntaje_total: 68, position: 10 }
];

export default function Ranking({ isOpen, onClose, participantId }: RankingProps) {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [currentUserRanking, setCurrentUserRanking] = useState<{ position: number; score: number; nickname: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRanking();
    }
  }, [isOpen, participantId]);

  const loadRanking = async () => {
    setLoading(true);

    const topRanking = await getTopRanking(10);

    if (topRanking.length === 0) {
      setRanking(demoData);
      setUsingDemo(true);
      setLoading(false);
      return;
    }

    setRanking(topRanking);
    setUsingDemo(false);

    if (participantId) {
      const participant = await getParticipant(participantId);
      const rankingInfo = await getParticipantRanking(participantId);

      if (participant && rankingInfo) {
        setCurrentUserRanking({
          position: rankingInfo.position,
          score: participant.puntaje_total,
          nickname: participant.nickname
        });
      }
    }

    setLoading(false);
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-6 h-6 text-white" fill="currentColor" />;
    if (position === 2) return <Medal className="w-6 h-6 text-white/80" fill="currentColor" />;
    if (position === 3) return <Award className="w-6 h-6 text-white/60" fill="currentColor" />;
    return null;
  };

  const getMedalColor = (position: number) => {
    if (position === 1) return 'bg-white/30 border-2 border-white/60 text-white';
    if (position === 2) return 'bg-white/20 border-2 border-white/40 text-white';
    if (position === 3) return 'bg-white/15 border-2 border-white/30 text-white';
    return 'bg-white/10';
  };

  if (!isOpen) return null;

  const isCurrentUserInTop10 = currentUserRanking && currentUserRanking.position <= 10;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundImage: 'url(/ranking.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="p-6 relative" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-400" fill="currentColor" />
            <h2 className="text-3xl font-bold text-white">
              Ranking de Expertos
            </h2>
          </div>
          <p className="text-white/90 text-sm">
            Top 10 participantes con mayor puntaje
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-[#2167AE] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Cargando ranking...</p>
            </div>
          ) : (
            <>
              {usingDemo && (
                <div className="bg-white/20 border border-white/40 rounded-lg p-3 mb-4 text-sm text-white">
                  Mostrando datos de ejemplo. Sé el primero en completar la aplicación.
                </div>
              )}

              <div className="space-y-2">
                {ranking.map((entry) => {
                  const isCurrentUser = !usingDemo && entry.id === participantId;
                  const position = entry.position || 0;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        position <= 3
                          ? `${getMedalColor(position)} shadow-lg`
                          : isCurrentUser
                          ? 'bg-[#A8C8E8] border-2 border-[#2167AE]'
                          : 'bg-white/15 hover:bg-white/25 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-[80px]">
                        {getMedalIcon(position)}
                        <span
                          className={`text-2xl font-bold ${
                            position <= 3 ? 'text-white' : 'text-white'
                          }`}
                        >
                          {position}
                        </span>
                      </div>

                      <div className="flex-1">
                        <p
                          className={`font-bold text-lg ${
                            position <= 3 ? 'text-white' : 'text-white'
                          }`}
                        >
                          {entry.nickname}
                          {isCurrentUser && (
                            <span className="ml-2 text-sm font-semibold">(Tú)</span>
                          )}
                        </p>
                      </div>

                      <div
                        className={`text-right ${
                          position <= 3 ? 'text-white' : 'text-white'
                        }`}
                      >
                        <p className="text-2xl font-bold">{entry.puntaje_total}</p>
                        <p className="text-xs opacity-80">puntos</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!usingDemo && currentUserRanking && !isCurrentUserInTop10 && (
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-3 font-semibold">Tu posición:</p>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-[#A8C8E8] border-2 border-[#2167AE]">
                    <div className="flex items-center gap-3 min-w-[80px]">
                      <span className="text-2xl font-bold text-[#2167AE]">
                        {currentUserRanking.position}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900">
                        {currentUserRanking.nickname} (Tú)
                      </p>
                    </div>

                    <div className="text-right text-[#2167AE]">
                      <p className="text-2xl font-bold">{currentUserRanking.score}</p>
                      <p className="text-xs opacity-80">puntos</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 py-4" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}>
          <button
            onClick={onClose}
            className="w-full bg-[#2167AE] text-white font-bold py-3 rounded-lg hover:bg-[#1E2D6B] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
