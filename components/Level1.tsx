'use client';

import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import { useSound } from '@/hooks/useSound';

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
  const { play } = useSound();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };
  const playTick = (urgent = false) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = urgent ? 880 : 440;
      osc.type = 'sine';
      gain.gain.setValueAtTime(urgent ? 0.15 : 0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch(e) {}
  };
  const playTimeUp = () => {
    try {
      const ctx = getAudioCtx();
      [220, 180, 150].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.2);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.2);
      });
    } catch(e) {}
  };
  const playCorrect = () => {
    try {
      const ctx = getAudioCtx();
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.15);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.15);
      });
    } catch(e) {}
  };
  const playWrong = () => {
    try {
      const ctx = getAudioCtx();
      [300, 250].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.2);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.2);
      });
    } catch(e) {}
  };

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
          play('timeup');
          playTimeUp();
          return 0;
        }
        playTick(prev <= 5);
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
    if (isCorrect) { play('correct'); playCorrect(); } else { play('wrong'); playWrong(); }
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
      setShowMessage(false);
      setIsFinished(true);
    }
  };

  const calculateTotalScore = () => responses.reduce((sum, r) => sum + r.puntos, 0);

  if (showInstructions) {
    return (
      <div style={{
        width: '100vw', height: '100vh', minHeight: '-webkit-fill-available',
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
      <div style={{ width: '100vw', height: '100vh', minHeight: '-webkit-fill-available', backgroundImage: 'url(/nivel1_1.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Header />
        <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(20px,4vw,40px)', maxWidth: 560, width: '90%', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', textAlign: 'center', marginTop: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>
            {calculateTotalScore() >= 15 ? '🏆' : calculateTotalScore() >= 8 ? '👍' : '💪'}
          </div>
          <h2 style={{ color: '#1E2D6B', fontWeight: 800, fontSize: 'clamp(20px,3vw,28px)', marginBottom: 8 }}>
            ¡Nivel 1 completado!
          </h2>
          <div style={{ display: 'inline-block', background: '#2167AE', color: 'white', fontWeight: 800, fontSize: 'clamp(16px,2.5vw,22px)', borderRadius: 12, padding: '8px 24px', marginBottom: 16 }}>
            {calculateTotalScore()} puntos
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, justifyContent: 'center' }}>
            <div style={{ background: '#E8F8F2', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
              <p style={{ fontWeight: 800, color: '#1ABC9C', fontSize: 24, margin: 0 }}>{responses.filter(r => r.correcta).length}/5</p>
              <p style={{ color: '#666', fontSize: 12, margin: 0 }}>Correctas</p>
            </div>
            <div style={{ background: '#FEF0F0', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
              <p style={{ fontWeight: 800, color: '#E74C3C', fontSize: 24, margin: 0 }}>{responses.filter(r => !r.correcta).length}/5</p>
              <p style={{ color: '#666', fontSize: 12, margin: 0 }}>Incorrectas</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, textAlign: 'left' }}>
            {questions.map((q, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: responses[i]?.correcta ? '#E8F8F2' : '#FEF0F0', border: `2px solid ${responses[i]?.correcta ? '#1ABC9C' : '#E74C3C'}` }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: responses[i]?.correcta ? '#1ABC9C' : '#E74C3C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                  {responses[i]?.correcta ? '✓' : '✗'}
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#1E2D6B', fontWeight: 600, lineHeight: 1.3 }}>{q.question}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onComplete(calculateTotalScore(), responses)} style={{ width: '100%', padding: '14px 0', background: '#1ABC9C', color: 'white', fontWeight: 800, fontSize: 'clamp(14px,2vw,18px)', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,188,156,0.4)' }}>
            Continuar al Nivel 2 →
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={{
      width: '100vw', height: '100vh', minHeight: '-webkit-fill-available',
      backgroundImage: 'url(/nivel1.1.png)', backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
      overflow: 'hidden', paddingBottom: 16, boxSizing: 'border-box'
    }}>
      <Header />

      {floatingEmoji && (
        <div key={floatingEmoji.id} style={{
          position: 'fixed', top: '40%', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 72, zIndex: 50,
          animation: 'float-up 1s ease forwards',
          pointerEvents: 'none'
        }}>
          {floatingEmoji.emoji}
        </div>
      )}

      <div style={{
        marginTop: 'clamp(60px, 10vh, 100px)',
        width: 'min(90vw, 1100px)',
        background: 'white', borderRadius: 16, padding: '20px 28px',
        border: '3px solid #1E2D6B', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        position: 'relative', zIndex: 20
      }}>
        <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '16px solid #1E2D6B' }} />
        <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '13px solid white' }} />
        <p style={{ margin: 0, textAlign: 'center', color: '#1E2D6B', fontWeight: 700, fontSize: 'clamp(16px, 2.4vw, 30px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif', lineHeight: 1.4 }}>
          {question.question}
        </p>
      </div>

      <div style={{
        marginTop: 24,
        width: 64, height: 64, borderRadius: '50%',
        background: 'white',
        border: `5px solid ${timeLeft <= 5 ? '#E74C3C' : timeLeft <= 10 ? '#F39C12' : '#1ABC9C'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 20, flexShrink: 0
      }}>
        <span style={{ fontWeight: 900, fontSize: 22, color: timeLeft <= 5 ? '#E74C3C' : timeLeft <= 10 ? '#F39C12' : '#1E2D6B', lineHeight: 1 }}>{timeLeft}</span>
        <span style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>seg</span>
      </div>

      <div style={{
        marginTop: 16,
        width: 'min(90vw, 700px)',
        display: 'flex', flexDirection: 'column', gap: 10, zIndex: 20
      }}>
        {question.options.map((opt) => {
          const label = opt.label;
          const feedback = optionFeedback[label];
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#F9D030', border: '4px solid #1E2D6B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 38, color: '#1E2D6B', flexShrink: 0,
                fontFamily: 'RobotRadicals, sans-serif', boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
              }}>
                {label}
              </div>
              <button
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer(label, opt.correct)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  background: feedback === 'correct' ? '#2167AE' : feedback === 'wrong' ? '#E74C3C' : 'rgba(255,255,255,0.92)',
                  border: '3px solid',
                  borderColor: feedback === 'correct' ? '#2167AE' : feedback === 'wrong' ? '#E74C3C' : '#1E2D6B',
                  borderRadius: 50, padding: '10px 16px',
                  cursor: selectedAnswer === null ? 'pointer' : 'default',
                  transition: 'all 0.3s',
                  animation: feedback === 'wrong' ? 'shake 0.5s ease' : feedback === 'correct' ? 'pulse-correct 0.5s ease' : 'none'
                }}
              >
                <span style={{
                  color: feedback ? 'white' : '#1E2D6B', fontWeight: 600,
                  fontSize: 'clamp(13px, 3.5vw, 20px)',
                  fontFamily: 'Zurich_Light_Condensed_BT, sans-serif',
                  textAlign: 'left', lineHeight: 1.2
                }}>
                  {opt.text}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        width: 'min(90vw, 500px)',
        display: 'flex', gap: 12, justifyContent: 'center',
        marginBottom: '5vh', zIndex: 20
      }}>
        {questions.map((_, idx) => (
          <div key={idx} style={{
            width: 52, height: 52, borderRadius: '50%',
            background: idx < currentQuestion
              ? (responses[idx]?.correcta ? '#1ABC9C' : '#E74C3C')
              : idx === currentQuestion ? '#F9D030' : 'rgba(255,255,255,0.3)',
            border: '3px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 28, color: idx === currentQuestion ? '#1E2D6B' : 'white',
            fontFamily: 'RobotRadicals, sans-serif',
            transition: 'all 0.3s',
            transform: idx === currentQuestion ? 'scale(1.2)' : 'scale(1)'
          }}>
            {idx < currentQuestion ? (responses[idx]?.correcta ? '✓' : '✗') : idx + 1}
          </div>
        ))}
      </div>

      {showMessage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(20px,4vw,40px)', maxWidth: 560, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', textAlign: 'center' }}>
            <p style={{ color: '#1E2D6B', fontSize: 'clamp(14px,1.8vw,20px)', fontWeight: 600, lineHeight: 1.5, marginBottom: 24, fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>{question.message}</p>
            {currentQuestion < questions.length - 1 ? (
              <button onClick={handleNext} style={{ width: '100%', padding: '14px 0', background: '#2167AE', color: 'white', fontWeight: 800, fontSize: 'clamp(14px,1.8vw,18px)', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                Siguiente pregunta →
              </button>
            ) : (
              <button onClick={handleNext} style={{ width: '100%', padding: '14px 0', background: '#1ABC9C', color: 'white', fontWeight: 800, fontSize: 'clamp(14px,1.8vw,18px)', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                Ver mis resultados 🏆
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
