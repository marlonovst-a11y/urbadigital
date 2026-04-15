'use client';

import { useState, useEffect, useRef } from 'react';
import Header from './Header';

function useInlineSvg(url: string) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  useEffect(() => {
    fetch(url)
      .then(r => r.text())
      .then(setSvgContent)
      .catch(() => setSvgContent(null));
  }, [url]);
  return svgContent;
}

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
  const svgContent = useInlineSvg('/nivel_1.svg');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [optionFeedback, setOptionFeedback] = useState<Record<string, 'correct' | 'wrong' | null>>({
    A: null, B: null, C: null
  });
  const answeredRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setOptionFeedback({ A: null, B: null, C: null });
    setSelectedAnswer(null);
    answeredRef.current = false;
  }, [currentQuestion]);

  useEffect(() => {
    if (showMessage || isFinished) return;

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
  }, [currentQuestion, showMessage, isFinished]);

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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#1E2D6B]">
      <Header />

      <main className="pt-12 md:pt-16 flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="relative w-full" style={{ maxHeight: 'calc(100vh - 48px)' }}>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {svgContent ? (
              <div
                className="absolute inset-0 w-full h-full nivel1-svg-wrapper"
                dangerouslySetInnerHTML={{ __html: svgContent }}
                style={{ lineHeight: 0 }}
              />
            ) : (
              <img
                src="/nivel_1.svg"
                alt="Nivel 1"
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            )}

            <div
              className="absolute inset-0"
              style={{ fontFamily: "'Zurich_Light_Condensed_BT', 'ZurichCondensed', sans-serif" }}
            >
              <div
                className="absolute flex items-center justify-center text-center px-4"
                style={{
                  left: '26.4%',
                  top: '8.7%',
                  width: '56.4%',
                  height: '22.6%',
                }}
              >
                <p
                  className="text-[#1E2D6B] leading-snug"
                  style={{
                    fontFamily: "'Zurich_Light_Condensed_BT', 'ZurichCondensed', sans-serif",
                    fontSize: 'clamp(0.75rem, 1.3vw, 1.35rem)',
                    fontWeight: 400,
                  }}
                >
                  {question.question}
                </p>
              </div>

              <div
                className="absolute w-full"
                style={{ top: '31%', left: '20%', width: '60%' }}
              >
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(30,45,107,0.25)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${(timeLeft / 20) * 100}%`,
                      background: timeLeft <= 5 ? '#E74C3C' : '#F9D030'
                    }}
                  />
                </div>
              </div>

              <button
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer('A', question.options[0].correct)}
                className="absolute flex items-center justify-center text-center"
                style={{
                  left: '18.2%',
                  top: '36.8%',
                  width: '35.7%',
                  height: '7.1%',
                  cursor: selectedAnswer === null ? 'pointer' : 'default',
                  background: 'transparent',
                  border: 'none',
                }}
              >
                <span
                  className="px-6 leading-tight"
                  style={{
                    fontFamily: "'Zurich_Light_Condensed_BT', 'ZurichCondensed', sans-serif",
                    fontSize: 'clamp(0.55rem, 1vw, 1rem)',
                    fontWeight: 300,
                    color: optionFeedback.A === 'correct' ? '#0a7c2e' : optionFeedback.A === 'wrong' ? '#c0392b' : '#1E2D6B',
                  }}
                >
                  {question.options[0].text}
                </span>
              </button>

              <button
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer('B', question.options[1].correct)}
                className="absolute flex items-center justify-center text-center"
                style={{
                  left: '60.6%',
                  top: '36.8%',
                  width: '35.7%',
                  height: '7.1%',
                  cursor: selectedAnswer === null ? 'pointer' : 'default',
                  background: 'transparent',
                  border: 'none',
                }}
              >
                <span
                  className="px-6 leading-tight"
                  style={{
                    fontFamily: "'Zurich_Light_Condensed_BT', 'ZurichCondensed', sans-serif",
                    fontSize: 'clamp(0.55rem, 1vw, 1rem)',
                    fontWeight: 300,
                    color: optionFeedback.B === 'correct' ? '#0a7c2e' : optionFeedback.B === 'wrong' ? '#c0392b' : '#1E2D6B',
                  }}
                >
                  {question.options[1].text}
                </span>
              </button>

              <button
                disabled={selectedAnswer !== null}
                onClick={() => handleAnswer('C', question.options[2].correct)}
                className="absolute flex items-center justify-center text-center"
                style={{
                  left: '33.9%',
                  top: '48%',
                  width: '43.2%',
                  height: '7.3%',
                  cursor: selectedAnswer === null ? 'pointer' : 'default',
                  background: 'transparent',
                  border: 'none',
                }}
              >
                <span
                  className="px-6 leading-tight"
                  style={{
                    fontFamily: "'Zurich_Light_Condensed_BT', 'ZurichCondensed', sans-serif",
                    fontSize: 'clamp(0.55rem, 1vw, 1rem)',
                    fontWeight: 300,
                    color: optionFeedback.C === 'correct' ? '#0a7c2e' : optionFeedback.C === 'wrong' ? '#c0392b' : '#1E2D6B',
                  }}
                >
                  {question.options[2].text}
                </span>
              </button>

            </div>
          </div>
        </div>

        {showMessage && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-8 max-w-2xl w-full">
              <p
                className="text-base md:text-xl text-[#1E2D6B] leading-relaxed mb-4 md:mb-6 text-center"
                style={{ fontFamily: "'Zurich_Light_Condensed_BT', 'ZurichCondensed', sans-serif" }}
              >
                {question.message}
              </p>
              <button
                onClick={handleNext}
                className="w-full bg-[#2167AE] text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg hover:bg-[#1a5391] transition-colors text-base md:text-lg min-h-[44px]"
              >
                {currentQuestion < questions.length - 1 ? 'Siguiente pregunta →' : 'Ver resultados'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
