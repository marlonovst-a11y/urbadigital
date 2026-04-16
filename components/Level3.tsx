'use client';

import { useState, useRef, useCallback } from 'react';
import Header from './Header';

interface Level3Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any) => void;
}

interface Action {
  id: number;
  accion: string;
  categoria: 'ANTES' | 'DURANTE' | 'DESPUÉS';
}

const actions: Action[] = [
  { id: 1, accion: 'Preparar mochila de emergencia', categoria: 'ANTES' },
  { id: 2, accion: 'Llamar a los servicios de emergencia', categoria: 'DURANTE' },
  { id: 3, accion: 'Limpiar y desinfectar la vivienda', categoria: 'DESPUÉS' },
  { id: 4, accion: 'Identificar rutas de evacuación', categoria: 'ANTES' },
  { id: 5, accion: 'Alejarse de zonas inundadas', categoria: 'DURANTE' },
  { id: 6, accion: 'Revisar daños estructurales', categoria: 'DESPUÉS' },
  { id: 7, accion: 'Almacenar agua potable', categoria: 'ANTES' },
  { id: 8, accion: 'No caminar en aguas de inundación', categoria: 'DURANTE' },
  { id: 9, accion: 'Reportar daños a las autoridades', categoria: 'DESPUÉS' },
];

type AnswerState = 'idle' | 'correct' | 'wrong';

interface Response {
  accion: string;
  respuesta_dada: 'ANTES' | 'DURANTE' | 'DESPUÉS';
  correcta: boolean;
  puntos: number;
}

export default function Level3({ participantId, nickname, onComplete }: Level3Props) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedCategory, setSelectedCategory] = useState<'ANTES' | 'DURANTE' | 'DESPUÉS' | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const answeredRef = useRef(false);
  const answerStateRef = useRef<AnswerState>('idle');

  const currentAction = actions[currentIndex];

  const handleAnswer = useCallback((category: 'ANTES' | 'DURANTE' | 'DESPUÉS') => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    answerStateRef.current = 'correct';

    const isCorrect = currentAction.categoria === category;
    const points = isCorrect ? 2.2 : 0;

    setSelectedCategory(category);
    setAnswerState(isCorrect ? 'correct' : 'wrong');

    const newResponse: Response = {
      accion: currentAction.accion,
      respuesta_dada: category,
      correcta: isCorrect,
      puntos: points,
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    setTimeout(() => {
      if (currentIndex < actions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setAnswerState('idle');
        setSelectedCategory(null);
        answeredRef.current = false;
        answerStateRef.current = 'idle';
      } else {
        const score = Math.round(Math.min(20, updatedResponses.reduce((sum, r) => sum + r.puntos, 0)));
        setTotalScore(score);
        setShowFinalFeedback(true);
      }
    }, 1500);
  }, [answerState, currentAction, currentIndex, responses]);

  const handleContinue = () => {
    onComplete(totalScore, responses);
  };

  const correctCount = responses.filter(r => r.correcta).length;

  if (showInstructions) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/nivel3_instruccion.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        <Header />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: 24 }}>
          <img src="/carmen_nivel3.png" style={{ width: 'clamp(120px, 15vw, 200px)' }} />
          <div style={{ background: 'white', borderRadius: 16, padding: '20px 28px', maxWidth: 420, border: '3px solid #2167AE', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderRight: '14px solid #2167AE' }} />
            <div style={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '12px solid white' }} />
            <p style={{ margin: '0 0 8px', fontWeight: 800, color: '#1E2D6B', fontSize: 'clamp(14px, 1.6vw, 18px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>
              ¡Nivel 3 — Arrastra y Decide!
            </p>
            <p style={{ margin: '0 0 16px', color: '#444', fontSize: 'clamp(12px, 1.3vw, 15px)', lineHeight: 1.5 }}>
              Carmen te guiará. Lee cada acción y decide si corresponde a <strong>ANTES</strong>, <strong>DURANTE</strong> o <strong>DESPUÉS</strong> de un desastre. ¡Tienes 9 acciones para clasificar!
            </p>
            <button onClick={() => setShowInstructions(false)} style={{ width: '100%', padding: '12px 0', background: '#1ABC9C', color: 'white', fontWeight: 800, fontSize: 'clamp(14px, 1.5vw, 17px)', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,188,156,0.4)' }}>
              ¡Comenzar! 🎯
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showFinalFeedback) {
    return (
      <div className="min-h-screen flex flex-col bg-[#ECEEEF]">
        <Header />
        <main className="pt-14 md:pt-24 flex-1 px-3 md:px-4 pb-8 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#2167AE] px-4 md:px-8 py-4 md:py-6 text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Nivel 3 completado</h2>
              <p className="text-blue-100 text-sm">Antes, Durante y Después del desastre</p>
            </div>
            <div className="px-4 md:px-8 py-4 md:py-6">
              <div className="flex gap-3 md:gap-6 mb-4 md:mb-6">
                <div className="flex-1 bg-[#EAF4FB] rounded-xl p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#2167AE]">{correctCount}/9</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Respuestas correctas</p>
                </div>
                <div className="flex-1 bg-[#E8F8F2] rounded-xl p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#27AE60]">{totalScore}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Puntos obtenidos</p>
                </div>
              </div>

              <div className="bg-[#F0F4FF] rounded-xl p-3 md:p-5 mb-4 md:mb-6">
                <p className="text-[#1E2D6B] text-xs md:text-sm leading-relaxed">
                  Conocer qué hacer antes, durante y después de un desastre puede salvar vidas.
                  La preparación anticipada reduce el impacto, actuar con calma durante la emergencia
                  protege a todos, y las acciones post-desastre permiten recuperar la normalidad de forma segura.
                </p>
              </div>

              <div className="space-y-2 mb-4 md:mb-6 max-h-64 overflow-y-auto pr-1">
                {responses.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ${
                      r.correcta ? 'bg-[#E8F8F2] text-[#1E5E38]' : 'bg-[#FEF0F0] text-[#7B1D1D]'
                    }`}
                  >
                    <span className="mt-0.5 flex-shrink-0">
                      {r.correcta ? (
                        <svg className="w-4 h-4 text-[#27AE60]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#E74C3C]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{r.accion}</p>
                      {!r.correcta && (
                        <p className="text-xs mt-0.5 opacity-75">
                          Tu respuesta: {r.respuesta_dada} &mdash; Correcta: {actions[i].categoria}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-3 bg-[#2167AE] hover:bg-[#1a5490] text-white font-bold rounded-xl transition-colors text-sm md:text-lg min-h-[44px]"
              >
                Continuar al Mapa
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/nivel3_fondo.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
      <Header />

      <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(300px, 55vw, 700px)', zIndex: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px 28px', border: '3px solid #1E2D6B', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative', textAlign: 'center' }}>
          <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '16px solid #1E2D6B' }} />
          <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '13px solid white' }} />
          <p style={{ margin: 0, color: '#1E2D6B', fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 48px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif', lineHeight: 1.3 }}>
            {currentAction.accion}
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '26%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 'clamp(12px, 3vw, 32px)', zIndex: 20 }}>
        {(['ANTES', 'DURANTE', 'DESPUÉS'] as const).map((cat) => {
          const isSelected = selectedCategory === cat;
          const isCorrect = answerState !== 'idle' && currentAction.categoria === cat;
          const isWrong = answerState !== 'idle' && selectedCategory === cat && !isCorrect;
          return (
            <button key={cat} onClick={() => handleAnswer(cat)} disabled={answerState !== 'idle'}
              style={{
                padding: 'clamp(8px, 1.2vw, 14px) clamp(16px, 2.5vw, 32px)',
                borderRadius: 12,
                border: '4px solid #5C3A1E',
                background: isCorrect ? '#1ABC9C' : isWrong ? '#E74C3C' : '#F9D030',
                color: isCorrect || isWrong ? 'white' : '#5C3A1E',
                fontWeight: 900,
                fontSize: 'clamp(24px, 3.5vw, 44px)',
                fontFamily: 'RobotRadicals, sans-serif',
                cursor: answerState === 'idle' ? 'pointer' : 'default',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.2s',
                transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                letterSpacing: '0.05em',
              }}>
              {cat}
            </button>
          );
        })}
      </div>

      {answerState !== 'idle' && (
        <div style={{ position: 'absolute', top: '60%', left: '50%', transform: 'translateX(-50%)', zIndex: 30, background: answerState === 'correct' ? 'rgba(26,188,156,0.75)' : 'rgba(231,76,60,0.75)', borderRadius: 16, padding: '12px 28px', color: 'white', fontWeight: 700, fontSize: 'clamp(13px, 1.5vw, 18px)', textAlign: 'center', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          {answerState === 'correct' ? `✅ ¡Correcto! "${currentAction.accion}" es una acción de ${currentAction.categoria}.` : `❌ Incorrecto. La respuesta correcta es ${currentAction.categoria}.`}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 16, zIndex: 20 }}>
        {actions.map((_, idx) => (
          <div key={idx} style={{ width: 56, height: 56, borderRadius: '50%', background: idx < currentIndex ? (responses[idx]?.correcta ? '#1ABC9C' : '#E74C3C') : idx === currentIndex ? '#F9D030' : 'rgba(255,255,255,0.3)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: idx === currentIndex ? '#1E2D6B' : 'white', fontFamily: 'RobotRadicals, sans-serif', transition: 'all 0.3s', transform: idx === currentIndex ? 'scale(1.2)' : 'scale(1)', boxShadow: idx === currentIndex ? '0 0 16px rgba(249,208,48,0.7)' : 'none' }}>
            {idx < currentIndex ? (responses[idx]?.correcta ? '✓' : '✗') : idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
