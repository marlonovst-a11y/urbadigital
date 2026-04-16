'use client';

import { useState, useEffect, useRef } from 'react';
import Header from './Header';

interface Level1Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any[]) => void;
}

const questions = [
  {
    id: 1,
    question: "¿Sabes qué hacer en caso de una inundación?",
    options: [
      { label: "A", text: "Esperar sin hacer nada", correct: false },
      { label: "B", text: "Mantener la calma, informarse por fuentes oficiales y seguir rutas seguras", correct: true },
      { label: "C", text: "Salir a la calle para observar el nivel del agua", correct: false }
    ],
    message: "Mantener la calma y seguir información oficial puede salvar vidas."
  },
  {
    id: 2,
    question: "¿Qué tareas deben cumplirse antes, durante y después de una inundación?",
    options: [
      { label: "A", text: "Prepararse con un plan familiar, evacuar si es necesario y limpiar de forma segura", correct: true },
      { label: "B", text: "Confiar únicamente en la ayuda externa", correct: false },
      { label: "C", text: "Solo actuar cuando la inundación ya ocurrió", correct: false }
    ],
    message: "La prevención y la preparación reducen riesgos y daños."
  },
  {
    id: 3,
    question: "¿Cuál es el principal objetivo de una mochila de emergencia ante una inundación?",
    options: [
      { label: "A", text: "Transportar ropa de uso diario", correct: false },
      { label: "B", text: "Guardar objetos de valor", correct: false },
      { label: "C", text: "Sobrevivir al menos 72 horas durante una emergencia", correct: true }
    ],
    message: "La mochila debe cubrir necesidades básicas mientras llega ayuda."
  },
  {
    id: 4,
    question: "¿Cuál es la forma más segura de abastecerte de agua durante una inundación?",
    options: [
      { label: "A", text: "Usar agua de piscinas", correct: false },
      { label: "B", text: "Usar agua embotellada o previamente almacenada", correct: true },
      { label: "C", text: "Tomar agua directamente de ríos o lluvia", correct: false }
    ],
    message: "El agua embotellada es la más segura porque no ha estado en contacto con contaminantes."
  },
  {
    id: 5,
    question: "¿Qué acciones debemos hacer para cuidar el planeta?",
    options: [
      { label: "A", text: "Reducir residuos, ahorrar agua y energía, y cuidar el entorno", correct: true },
      { label: "B", text: "Pensar que los cambios del clima no nos afectan", correct: false },
      { label: "C", text: "Usar más recursos naturales sin control", correct: false }
    ],
    message: "Cuidar el planeta ayuda a reducir eventos extremos como inundaciones."
  }
];


export default function Level1({ participantId, nickname, onComplete }: Level1Props) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [optionFeedback, setOptionFeedback] = useState<Record<string, 'correct' | 'wrong' | null>>({
    A: null, B: null, C: null
  });
  const [floatingEmoji, setFloatingEmoji] = useState<{emoji: string, id: number} | null>(null);
  const answeredRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setOptionFeedback({ A: null, B: null, C: null });
    setSelectedAnswer(null);
    answeredRef.current = false;
  }, [currentQuestion]);

  useEffect(() => {
    if (showMessage || isFinished || showInstructions) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (!answeredRef.current) {
            answeredRef.current = true;
            setResponses(r => [...r, {
              pregunta: currentQuestion + 1,
              respuesta: 'Tiempo agotado',
              correcta: false, tiempo: 20, puntos: 0
            }]);
            setShowMessage(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, showMessage, isFinished, showInstructions]);

  const handleAnswer = (label: string, isCorrect: boolean) => {
    if (answeredRef.current) return;
    answeredRef.current = true;

    if (timerRef.current) clearInterval(timerRef.current);

    const q = questions[currentQuestion];
    const newFeedback: Record<string, 'correct' | 'wrong' | null> = { A: null, B: null, C: null };
    newFeedback[label] = isCorrect ? 'correct' : 'wrong';
    if (!isCorrect) {
      const correctLabel = q.options.find(o => o.correct)?.label;
      if (correctLabel) newFeedback[correctLabel] = 'correct';
    }
    setOptionFeedback(newFeedback);
    setFloatingEmoji({ emoji: isCorrect ? '✅' : '❌', id: Date.now() });
    setTimeout(() => setFloatingEmoji(null), 1000);

    const timeTaken = 20 - timeLeft;
    let points = 0;
    if (isCorrect) {
      points = timeTaken <= 5 ? 4 : timeTaken <= 12 ? 3 : 2;
    }

    setSelectedAnswer(label);
    setResponses(prev => [...prev, {
      pregunta: currentQuestion + 1,
      respuesta: label, correcta: isCorrect,
      tiempo: timeTaken, puntos: points
    }]);

    setTimeout(() => setShowMessage(true), 4000);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(20);
      setSelectedAnswer(null);
      setShowMessage(false);
    } else {
      setIsFinished(true);
    }
  };

  const calculateTotalScore = () => responses.reduce((sum, r) => sum + r.puntos, 0);

  if (showInstructions) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        backgroundImage: 'url(/nivel1_instruccion.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        <Header />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex', alignItems: 'center', gap: 24
        }}>
          <img src="/manuel_nivel1.png" style={{ width: 'clamp(120px, 15vw, 200px)' }} />
          <div style={{
            background: 'white', borderRadius: 16, padding: '20px 28px',
            maxWidth: 420, border: '3px solid #2167AE',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative'
          }}>
            <div style={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)',
              width: 0, height: 0, borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent', borderRight: '14px solid #2167AE' }} />
            <div style={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)',
              width: 0, height: 0, borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent', borderRight: '12px solid white' }} />
            <p style={{ margin: '0 0 8px', fontWeight: 800, color: '#1E2D6B',
              fontSize: 'clamp(14px, 1.6vw, 18px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>
              ¡Nivel 1 — Trivia de Prevención!
            </p>
            <p style={{ margin: '0 0 16px', color: '#444', fontSize: 'clamp(12px, 1.3vw, 15px)', lineHeight: 1.5 }}>
              Roberto te hará <strong>5 preguntas</strong> sobre prevención de inundaciones. Tienes <strong>20 segundos</strong> por pregunta para elegir la respuesta correcta. ¡Responde rápido para ganar más puntos!
            </p>
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                width: '100%', padding: '12px 0',
                background: '#1ABC9C', color: 'white',
                fontWeight: 800, fontSize: 'clamp(14px, 1.5vw, 17px)',
                borderRadius: 50, border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(26,188,156,0.4)'
              }}
            >
              ¡Comenzar! 🎯
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen flex flex-col bg-[#2167AE] relative overflow-hidden">
        <Header />
        <main className="pt-14 md:pt-24 flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{calculateTotalScore()} puntos</h1>
            <p className="text-lg md:text-2xl text-white mb-8">¡Excelente trabajo, {nickname}!</p>
            <button
              onClick={() => onComplete(calculateTotalScore(), responses)}
              className="bg-white text-[#2167AE] font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg hover:bg-gray-100 transition-colors text-base md:text-lg min-h-[44px]"
            >
              Continuar al Nivel 2
            </button>
          </div>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/nivel1.1.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
      <Header />

      <div style={{ position: 'absolute', bottom: '27%', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', border: `5px solid ${timeLeft <= 5 ? '#E74C3C' : timeLeft <= 10 ? '#F39C12' : '#1ABC9C'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', flexDirection: 'column' }}>
          <span style={{ fontWeight: 900, fontSize: 28, color: timeLeft <= 5 ? '#E74C3C' : timeLeft <= 10 ? '#F39C12' : '#1E2D6B', lineHeight: 1 }}>{timeLeft}</span>
          <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>seg</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '13%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(400px, 80vw, 1100px)', zIndex: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '20px 28px', border: '3px solid #1E2D6B', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '16px solid #1E2D6B' }} />
          <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '13px solid white' }} />
          <p style={{ margin: 0, textAlign: 'center', color: '#1E2D6B', fontWeight: 700, fontSize: 'clamp(18px, 2.4vw, 30px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif', lineHeight: 1.4 }}>
            {question.question}
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '31%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(500px, 85vw, 1100px)', display: 'flex', gap: 16, zIndex: 20 }}>
        {floatingEmoji && (
          <div key={floatingEmoji.id} style={{
            position: 'absolute', top: '35%', left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 72, zIndex: 50,
            animation: 'float-up 1s ease forwards',
            pointerEvents: 'none'
          }}>
            {floatingEmoji.emoji}
          </div>
        )}
        {['A', 'B'].map((label, idx) => {
          const opt = question.options[idx];
          const feedback = optionFeedback[label];
          return (
            <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F9D030', border: '4px solid #1E2D6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 48, color: '#1E2D6B', flexShrink: 0, fontFamily: 'RobotRadicals, sans-serif', boxShadow: '0 3px 10px rgba(0,0,0,0.3)' }}>
                {label}
              </div>
              <button disabled={selectedAnswer !== null} onClick={() => handleAnswer(label, opt.correct)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', background: feedback === 'correct' ? '#2167AE' : feedback === 'wrong' ? '#E74C3C' : 'rgba(255,255,255,0.92)', border: '3px solid', borderColor: feedback === 'correct' ? '#2167AE' : feedback === 'wrong' ? '#E74C3C' : '#1E2D6B', borderRadius: 50, padding: '10px 20px', cursor: selectedAnswer === null ? 'pointer' : 'default', transition: 'all 0.3s', animation: optionFeedback[label] === 'wrong' ? 'shake 0.5s ease' : optionFeedback[label] === 'correct' ? 'pulse-correct 0.5s ease' : 'none', ...(label === 'B' ? { minWidth: 'clamp(250px, 35vw, 500px)' } : {}) }}>
                <span style={{ color: feedback ? 'white' : '#1E2D6B', fontWeight: 600, fontSize: 'clamp(15px, 1.8vw, 22px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif', textAlign: 'left' }}>{opt.text}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(300px, 55vw, 700px)', zIndex: 20 }}>
        {(() => {
          const opt = question.options[2];
          const feedback = optionFeedback['C'];
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F9D030', border: '4px solid #1E2D6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 48, color: '#1E2D6B', flexShrink: 0, fontFamily: 'RobotRadicals, sans-serif', boxShadow: '0 3px 10px rgba(0,0,0,0.3)' }}>
                C
              </div>
              <button disabled={selectedAnswer !== null} onClick={() => handleAnswer('C', opt.correct)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', background: feedback === 'correct' ? '#2167AE' : feedback === 'wrong' ? '#E74C3C' : 'rgba(255,255,255,0.92)', border: '3px solid', borderColor: feedback === 'correct' ? '#2167AE' : feedback === 'wrong' ? '#E74C3C' : '#1E2D6B', borderRadius: 50, padding: '10px 20px', cursor: selectedAnswer === null ? 'pointer' : 'default', transition: 'all 0.3s', animation: optionFeedback['C'] === 'wrong' ? 'shake 0.5s ease' : optionFeedback['C'] === 'correct' ? 'pulse-correct 0.5s ease' : 'none' }}>
                <span style={{ color: feedback ? 'white' : '#1E2D6B', fontWeight: 600, fontSize: 'clamp(15px, 1.8vw, 22px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif', textAlign: 'left' }}>{opt.text}</span>
              </button>
            </div>
          );
        })()}
      </div>

      <div style={{ position: 'absolute', bottom: '7%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 24, zIndex: 20, width: 'clamp(300px, 55vw, 700px)', justifyContent: 'center' }}>
        {questions.map((_, idx) => (
          <div key={idx} style={{ width: 76, height: 76, borderRadius: '50%', background: idx < currentQuestion ? '#1ABC9C' : idx === currentQuestion ? '#F9D030' : 'rgba(255,255,255,0.3)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 42, color: idx === currentQuestion ? '#1E2D6B' : 'white', fontFamily: 'RobotRadicals, sans-serif', transition: 'all 0.3s', transform: idx === currentQuestion ? 'scale(1.2)' : 'scale(1)' }}>
            {idx < currentQuestion ? '✓' : idx + 1}
          </div>
        ))}
      </div>

      {showMessage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(20px,4vw,40px)', maxWidth: 560, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', textAlign: 'center' }}>
            <p style={{ color: '#1E2D6B', fontSize: 'clamp(14px,1.8vw,20px)', fontWeight: 600, lineHeight: 1.5, marginBottom: 24, fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>{question.message}</p>
            <button onClick={handleNext} style={{ width: '100%', padding: '14px 0', background: '#2167AE', color: 'white', fontWeight: 800, fontSize: 'clamp(14px,1.8vw,18px)', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
              {currentQuestion < questions.length - 1 ? 'Siguiente pregunta →' : 'Ver resultados'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
