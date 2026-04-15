'use client';

import { useState } from 'react';

interface FinalEvaluationProps {
  participantId: string;
  nickname: string;
  onComplete: (responses: { pregunta_1: string; pregunta_2: string; pregunta_3: string }) => void;
}

export default function FinalEvaluation({ participantId, nickname, onComplete }: FinalEvaluationProps) {
  const [answer1, setAnswer1] = useState<string>('');
  const [answer2, setAnswer2] = useState<string>('');
  const [answer3, setAnswer3] = useState<string>('');

  const handleSubmit = () => {
    if (answer1 && answer2 && answer3) {
      onComplete({ pregunta_1: answer1, pregunta_2: answer2, pregunta_3: answer3 });
    }
  };

  const isComplete = answer1 && answer2 && answer3;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url(/evaluacion.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <main className="flex-1 px-3 md:px-4 py-8 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto">
          <div className="bg-white/90 rounded-lg shadow-lg p-4 md:p-8">
            <div className="mb-4 md:mb-6">
              <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-[#1ABC9C] text-white font-bold rounded-full mb-3 md:mb-4 text-sm md:text-base">
                +10 puntos al completar
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E2D6B] mb-2">
                Evaluación Final
              </h1>
              <p className="text-gray-700 text-sm md:text-base">
                Responde estas tres preguntas para desbloquear tus 10 puntos finales.
              </p>
            </div>

            <div className="space-y-5 md:space-y-8">
              <div className="bg-[#ECEEEF] rounded-lg p-4 md:p-6">
                <h3 className="font-bold text-[#1E2D6B] mb-3 md:mb-4 text-sm md:text-base">
                  1. ¿Has aprendido algo nuevo de estos consejos, contenidos y materiales?
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {['Sí, significativamente', 'Sí, moderadamente', 'Sí, de forma limitada', 'No, en absoluto'].map((option) => (
                    <label
                      key={option}
                      className={`block p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        answer1 === option
                          ? 'bg-[#2167AE] border-[#2167AE] text-white'
                          : 'bg-white border-gray-300 text-gray-800 hover:border-[#2167AE]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer1"
                        value={option}
                        checked={answer1 === option}
                        onChange={(e) => setAnswer1(e.target.value)}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm md:text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-[#ECEEEF] rounded-lg p-4 md:p-6">
                <h3 className="font-bold text-[#1E2D6B] mb-3 md:mb-4 text-sm md:text-base">
                  2. ¿Fue útil la información/contenido que revisaste en la plataforma?
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {['Sí, mucho', 'Sí, bastante', 'Sí, poco', 'No, nada'].map((option) => (
                    <label
                      key={option}
                      className={`block p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        answer2 === option
                          ? 'bg-[#2167AE] border-[#2167AE] text-white'
                          : 'bg-white border-gray-300 text-gray-800 hover:border-[#2167AE]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer2"
                        value={option}
                        checked={answer2 === option}
                        onChange={(e) => setAnswer2(e.target.value)}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm md:text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-[#ECEEEF] rounded-lg p-4 md:p-6">
                <h3 className="font-bold text-[#1E2D6B] mb-3 md:mb-4 text-sm md:text-base">
                  3. ¿Piensas aplicar estos consejos?
                </h3>
                <div className="space-y-2 md:space-y-3">
                  {['Sí, definitivamente los aplicaré', 'Probablemente los aplicaré', 'Es poco probable que los aplique', 'No los aplicaré'].map((option) => (
                    <label
                      key={option}
                      className={`block p-3 md:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        answer3 === option
                          ? 'bg-[#2167AE] border-[#2167AE] text-white'
                          : 'bg-white border-gray-300 text-gray-800 hover:border-[#2167AE]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer3"
                        value={option}
                        checked={answer3 === option}
                        onChange={(e) => setAnswer3(e.target.value)}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm md:text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`w-full py-3 mt-6 md:mt-8 font-bold rounded-lg transition-colors text-sm md:text-lg min-h-[44px] ${
                isComplete
                  ? 'bg-[#1ABC9C] text-white hover:bg-[#27AE60] cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Ver mi puntaje final
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
