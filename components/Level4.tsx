'use client';

import { useState, useEffect } from 'react';
import Header from './Header';

interface Level4Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any) => void;
}

interface Challenge {
  id: number;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  correcta: 'A' | 'B';
  mensaje: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    pregunta: '¿Qué imagen ayuda más al planeta?',
    opcionA: 'Bombilla apagada / luz natural',
    opcionB: 'Casa con luces encendidas de día',
    correcta: 'A',
    mensaje: 'Reducir el consumo de energía disminuye las emisiones de gases contaminantes.'
  },
  {
    id: 2,
    pregunta: 'Selecciona la mejor imagen:',
    opcionA: 'Agua corriendo sin uso',
    opcionB: 'Persona cerrando la llave',
    correcta: 'B',
    mensaje: 'Ahorrar agua es clave frente a sequías.'
  },
  {
    id: 3,
    pregunta: '¿Qué imagen cuida más el planeta?',
    opcionA: 'Persona caminando o en bicicleta',
    opcionB: 'Auto emitiendo humo',
    correcta: 'A',
    mensaje: 'El transporte sostenible reduce la contaminación del aire.'
  },
  {
    id: 4,
    pregunta: 'Elige la imagen correcta:',
    opcionA: 'Basura en ríos o calles',
    opcionB: 'Separación de residuos y reciclaje',
    correcta: 'B',
    mensaje: 'La mala gestión de residuos agrava la contaminación ambiental.'
  },
  {
    id: 5,
    pregunta: '¿Qué imagen representa una buena decisión?',
    opcionA: 'Compra consciente y productos reutilizables',
    opcionB: 'Consumo excesivo y desechables',
    correcta: 'A',
    mensaje: 'Consumir solo lo necesario reduce la presión sobre el planeta.'
  }
];

export default function Level4({ participantId, nickname, onComplete }: Level4Props) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);

  const challenge = challenges[currentChallenge];

  const handleSelectOption = (option: 'A' | 'B') => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (!selectedOption) return;

    const isCorrect = selectedOption === challenge.correcta;
    const response = {
      reto: challenge.pregunta,
      opcion_elegida: selectedOption,
      correcta: isCorrect,
      puntos: isCorrect ? 4 : 0
    };

    setResponses([...responses, response]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setShowFinalFeedback(true);
    }
  };

  const calculateScore = () => {
    return responses.reduce((acc, r) => acc + r.puntos, 0);
  };

  const handleContinue = () => {
    const score = calculateScore();
    onComplete(score, responses);
  };

  const getOptionClass = (option: 'A' | 'B') => {
    if (!showFeedback) {
      return selectedOption === option
        ? 'border-[#2167AE] bg-[#2167AE] text-white shadow-lg scale-105'
        : 'border-gray-300 bg-white text-gray-800 hover:border-[#2167AE] hover:shadow-md';
    }

    if (option === challenge.correcta) {
      return 'border-[#1ABC9C] bg-[#1ABC9C] text-white';
    }

    if (selectedOption === option && option !== challenge.correcta) {
      return 'border-[#E74C3C] bg-[#E74C3C] text-white';
    }

    return 'border-gray-300 bg-gray-100 text-gray-400 opacity-60';
  };

  const getBadge = (option: 'A' | 'B') => {
    if (!showFeedback) return null;

    if (option === challenge.correcta) {
      return (
        <div className="absolute -top-3 -right-3 bg-[#1ABC9C] text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg">
          ¡Correcto!
        </div>
      );
    }

    if (selectedOption === option && option !== challenge.correcta) {
      return (
        <div className="absolute -top-3 -right-3 bg-[#E74C3C] text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg">
          Incorrecto
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ECEEEF] relative overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#A8C8E8] opacity-40" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#4A90D9] opacity-30" />
      <div className="absolute top-1/2 left-5 w-20 h-20 bg-[#2167AE] opacity-20" style={{ borderRadius: '50% 50% 0 0' }} />

      <Header />

      <main className="pt-24 flex-1 px-4 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {!showFinalFeedback ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-6 mb-6">
                <img src="/abuelo.svg" alt="Don Manuel" style={{ height: '150px' }} className="shadow-md" />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#1E2D6B] mb-2">
                    Nivel 4: Reto de Respuesta Rápida
                  </h1>
                  <div className="bg-[#A8C8E8] rounded-lg px-4 py-3 inline-block">
                    <p className="text-[#1E2D6B] font-semibold">
                      Decisiones Responsables con el Ambiente
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mb-8">
                {challenges.map((_, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      index < currentChallenge
                        ? 'bg-[#1ABC9C] text-white'
                        : index === currentChallenge
                        ? 'bg-[#2167AE] text-white scale-110'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1E2D6B] text-center mb-6">
                  {challenge.pregunta}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    onClick={() => handleSelectOption('A')}
                    className={`relative border-4 rounded-lg p-6 cursor-pointer transition-all duration-300 ${getOptionClass('A')}`}
                  >
                    {getBadge('A')}
                    <div className="aspect-video bg-gradient-to-br from-[#A8C8E8] to-[#4A90D9] rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-white text-6xl">
                        {challenge.id === 1 && '💡'}
                        {challenge.id === 2 && '🚰'}
                        {challenge.id === 3 && '🚶'}
                        {challenge.id === 4 && '♻️'}
                        {challenge.id === 5 && '🛒'}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2167AE] text-white font-bold flex items-center justify-center flex-shrink-0">
                        A
                      </div>
                      <p className="font-semibold text-lg">{challenge.opcionA}</p>
                    </div>
                  </div>

                  <div
                    onClick={() => handleSelectOption('B')}
                    className={`relative border-4 rounded-lg p-6 cursor-pointer transition-all duration-300 ${getOptionClass('B')}`}
                  >
                    {getBadge('B')}
                    <div className="aspect-video bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-white text-6xl">
                        {challenge.id === 1 && '💡'}
                        {challenge.id === 2 && '🚰'}
                        {challenge.id === 3 && '🚗'}
                        {challenge.id === 4 && '🗑️'}
                        {challenge.id === 5 && '🛍️'}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2167AE] text-white font-bold flex items-center justify-center flex-shrink-0">
                        B
                      </div>
                      <p className="font-semibold text-lg">{challenge.opcionB}</p>
                    </div>
                  </div>
                </div>
              </div>

              {showFeedback && (
                <div className="bg-[#2167AE] text-white rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-xl mb-3">
                    {selectedOption === challenge.correcta ? '¡Muy bien!' : 'Aprende de esto'}
                  </h3>
                  <p className="text-lg leading-relaxed">{challenge.mensaje}</p>
                </div>
              )}

              {!showFeedback ? (
                <button
                  onClick={handleConfirm}
                  disabled={!selectedOption}
                  className={`w-full py-3 font-bold rounded-lg transition-colors text-lg ${
                    selectedOption
                      ? 'bg-[#2167AE] text-white hover:bg-[#1E2D6B]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmar respuesta
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-[#1ABC9C] text-white font-bold rounded-lg hover:bg-[#27AE60] transition-colors text-lg"
                >
                  {currentChallenge < challenges.length - 1 ? 'Siguiente reto' : 'Ver resultados'}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-6 mb-6">
                <img src="/abuelo.svg" alt="Don Manuel" style={{ height: '150px' }} className="shadow-md" />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-[#1E2D6B] mb-2">
                    ¡Completaste el Reto de Respuesta Rápida!
                  </h1>
                </div>
              </div>

              <div className="bg-[#2167AE] text-white rounded-lg p-6 mb-6">
                <h3 className="font-bold text-xl mb-3">
                  Obtuviste {calculateScore()} de 20 puntos
                </h3>
                <p className="text-lg leading-relaxed">
                  Cada decisión responsable con el ambiente suma. Reducir el consumo, ahorrar agua, usar transporte sostenible, reciclar y consumir conscientemente son acciones que protegen nuestro planeta y reducen los riesgos climáticos. Tus elecciones de hoy construyen un futuro más seguro para todos.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {responses.map((response, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      response.correcta
                        ? 'bg-green-50 border-[#1ABC9C]'
                        : 'bg-red-50 border-[#E74C3C]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        response.correcta ? 'bg-[#1ABC9C]' : 'bg-[#E74C3C]'
                      }`}>
                        {response.correcta ? (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1E2D6B]">{response.reto}</p>
                        <p className="text-sm text-gray-600">
                          Tu respuesta: <span className="font-semibold">{response.opcion_elegida}</span>
                        </p>
                      </div>
                      <div className="text-lg font-bold text-[#1E2D6B]">
                        {response.puntos} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-3 bg-[#1ABC9C] text-white font-bold rounded-lg hover:bg-[#27AE60] transition-colors text-lg"
              >
                Continuar al Mapa
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
