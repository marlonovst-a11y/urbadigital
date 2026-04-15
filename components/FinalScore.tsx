'use client';

import { useState } from 'react';
import Ranking from './Ranking';
import { Facebook, MessageCircle, Linkedin, Trophy } from 'lucide-react';

interface FinalScoreProps {
  participantId: string;
  nickname: string;
  totalScore: number;
  levelScores: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
    evaluation: number;
  };
  onContinue: () => void;
}

export default function FinalScore({ participantId, nickname, totalScore, levelScores, onContinue }: FinalScoreProps) {
  const [isRankingOpen, setIsRankingOpen] = useState(false);

  const getMessage = (score: number) => {
    if (score >= 90) return '¡Eres un experto en gestión de riesgos!';
    if (score >= 70) return '¡Muy bien! Tienes buenos conocimientos.';
    if (score >= 50) return '¡Buen esfuerzo! Sigue aprendiendo.';
    return '¡Gracias por participar!';
  };

  const shareText = `Obtuve ${totalScore}/100 puntos en Aprende y Previene de Zurich Seguros Ecuador x Plan International. Aprende a gestionar riesgos!`;

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(shareText);

    let shareUrl = '';
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${text}%20${url}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: 'url(/puntaje_final.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>

      <main className="flex-1 px-3 md:px-4 pb-8">
        <div className="max-w-3xl mx-auto pt-[440px] md:pt-[460px]">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-5 md:mb-8 text-center" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
              Tu Puntaje Final
            </h1>

            <div className="flex flex-col items-center mb-5 md:mb-8">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-[#2167AE] flex items-center justify-center shadow-xl mb-4">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-white">{totalScore}</div>
                  <div className="text-white text-base md:text-lg">/100</div>
                </div>
              </div>
              <p className="text-lg md:text-2xl font-bold text-white text-center" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                {getMessage(totalScore)}
              </p>
            </div>

            <div className="bg-white/15 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="font-bold text-white mb-3 md:mb-4 text-sm md:text-base">Desglose por nivel</h3>
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 text-white">Nivel</th>
                    <th className="text-right py-2 text-white">Puntos</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  <tr className="border-b border-gray-200">
                    <td className="py-1.5 md:py-2">N1: Trivia de Prevención</td>
                    <td className="text-right font-semibold">{levelScores.level1}/20</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-1.5 md:py-2">N2: Identifica el Riesgo</td>
                    <td className="text-right font-semibold">{levelScores.level2}/20</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-1.5 md:py-2">N3: Arrastra y Decide</td>
                    <td className="text-right font-semibold">{levelScores.level3}/20</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-1.5 md:py-2">N4: Reto de Respuesta Rápida</td>
                    <td className="text-right font-semibold">{levelScores.level4}/20</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-1.5 md:py-2">N5: Crucigrama de Multiamenazas</td>
                    <td className="text-right font-semibold">{levelScores.level5}/20</td>
                  </tr>
                  <tr className="border-b-2 border-gray-300">
                    <td className="py-1.5 md:py-2">Evaluación Final</td>
                    <td className="text-right font-semibold">{levelScores.evaluation}/10</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 md:py-2 font-bold text-white">Total</td>
                    <td className="text-right font-bold text-white text-sm md:text-lg">{totalScore}/100</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsRankingOpen(true)}
              className="w-full py-3 bg-[#2167AE] text-white font-bold rounded-lg hover:bg-[#1E2D6B] transition-colors text-sm md:text-lg mb-3 md:mb-4 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Trophy className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
              Ver ranking de participantes
            </button>

            <div className="mb-4 md:mb-6">
              <h3 className="font-bold text-[#1E2D6B] mb-2 md:mb-3 text-center text-sm md:text-base">Comparte tu logro</h3>
              <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm min-h-[44px]"
                >
                  <Facebook className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity text-sm min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity text-sm min-h-[44px]"
                >
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                  LinkedIn
                </button>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full py-3 bg-[#2167AE] text-white font-bold rounded-lg hover:bg-[#1E2D6B] transition-colors text-sm md:text-lg min-h-[44px]"
            >
              Finalizar
            </button>
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
