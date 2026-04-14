'use client';

import { useState, useEffect } from 'react';
import Header from './Header';

interface Level2Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any) => void;
}

interface Hazard {
  id: number;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const hazards: Hazard[] = [
  { id: 1, label: 'Cables eléctricos expuestos', x: 50, y: 120, width: 80, height: 60 },
  { id: 2, label: 'Olla en llamas sin supervisión', x: 150, y: 100, width: 70, height: 70 },
  { id: 3, label: 'Ventana con vidrios rotos', x: 280, y: 110, width: 60, height: 60 },
  { id: 4, label: 'Piso mojado', x: 180, y: 260, width: 90, height: 40 },
  { id: 5, label: 'Calles inundadas', x: 420, y: 280, width: 150, height: 50 },
  { id: 6, label: 'Basura tapando alcantarillas', x: 380, y: 240, width: 80, height: 60 },
  { id: 7, label: 'Viviendas en zonas bajas', x: 500, y: 140, width: 100, height: 80 },
  { id: 8, label: 'Ratón desplazado por el agua', x: 450, y: 260, width: 50, height: 40 }
];

export default function Level2({ participantId, nickname, onComplete }: Level2Props) {
  const [timeLeft, setTimeLeft] = useState(25);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [realFound, setRealFound] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !revealed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !revealed) {
      revealAll();
    }
  }, [timeLeft, revealed]);

  const findDanger = (id: number) => {
    if (!revealed && !found.has(id)) {
      const newFound = new Set(found);
      newFound.add(id);
      setFound(newFound);
      const newRealFound = new Set(realFound);
      newRealFound.add(id);
      setRealFound(newRealFound);
    }
  };

  const revealAll = () => {
    setRevealed(true);
    const allIds = hazards.map(h => h.id);
    setFound(new Set(allIds));
    setTimeout(() => setShowFeedback(true), 1000);
  };

  const calculateScore = () => {
    const count = realFound.size;
    if (count === 8) return 20;
    if (count >= 5) return 15;
    if (count >= 3) return 10;
    if (count >= 1) return 5;
    return 0;
  };

  const handleContinue = () => {
    const score = calculateScore();
    const responses = {
      encontrados: realFound.size,
      peligros_encontrados: Array.from(realFound),
      tiempo: 25 - timeLeft,
      puntos: score
    };
    onComplete(score, responses);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ECEEEF]">
      <Header />

      <main className="pt-24 flex-1 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start gap-6 mb-6">
              <img src="/nina.svg" alt="Sofía" style={{ height: '150px' }} className="shadow-md" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#1E2D6B] mb-2">
                  Nivel 2: Identifica el Riesgo en la Imagen
                </h1>
                <p className="text-gray-700 text-lg mb-4">
                  ¡Hola! Soy Sofía. Encuentra los 8 peligros antes de que se acabe el tiempo.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F39C12] transition-all duration-1000"
                      style={{ width: `${(timeLeft / 25) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-[#F39C12] text-xl">
                    {timeLeft}s
                  </span>
                </div>
              </div>
            </div>

            <div className="relative bg-[#A8C8E8] rounded-lg overflow-hidden mb-6" style={{ height: '400px' }}>
              <svg viewBox="0 0 650 350" className="w-full h-full">
                <rect x="0" y="0" width="650" height="350" fill="#A8C8E8" />

                <rect x="420" y="270" width="200" height="15" fill="#4A90D9" opacity="0.7" />
                <ellipse cx="480" cy="285" rx="40" ry="8" fill="#4A90D9" opacity="0.5" />
                <ellipse cx="540" cy="290" rx="35" ry="7" fill="#4A90D9" opacity="0.5" />

                <rect x="100" y="180" width="220" height="140" fill="#FFFFFF" stroke="#1E2D6B" strokeWidth="3" />
                <polygon points="100,180 210,120 320,180" fill="#E74C3C" stroke="#1E2D6B" strokeWidth="3" />
                <rect x="180" y="240" width="60" height="80" fill="#C8D635" stroke="#1E2D6B" strokeWidth="2" />
                <circle cx="210" cy="280" r="4" fill="#1E2D6B" />

                <rect x="130" y="200" width="50" height="40" fill="#4A90D9" stroke="#1E2D6B" strokeWidth="2" />
                <line x1="135" y1="205" x2="175" y2="235" stroke="#E74C3C" strokeWidth="2" />
                <line x1="175" y1="205" x2="135" y2="235" stroke="#E74C3C" strokeWidth="2" />

                <rect x="240" y="200" width="50" height="40" fill="#4A90D9" stroke="#1E2D6B" strokeWidth="2" />
                <ellipse cx="265" cy="220" rx="15" ry="18" fill="#F39C12" />
                <path d="M 260 215 Q 265 205 270 215" fill="#E74C3C" />
                <path d="M 255 210 Q 265 200 275 210" fill="#F39C12" />

                <line x1="50" y1="140" x2="120" y2="140" stroke="#1E2D6B" strokeWidth="3" />
                <line x1="65" y1="140" x2="60" y2="155" stroke="#1E2D6B" strokeWidth="2" />
                <line x1="85" y1="140" x2="80" y2="155" stroke="#1E2D6B" strokeWidth="2" />
                <line x1="105" y1="140" x2="100" y2="155" stroke="#1E2D6B" strokeWidth="2" />
                <circle cx="75" cy="135" r="5" fill="#F39C12" />
                <path d="M 72 132 L 75 128 L 78 132 L 80 130 L 82 134 L 78 137 L 75 140 L 72 137 Z" fill="#F39C12" opacity="0.8" />

                <ellipse cx="210" cy="300" rx="50" ry="12" fill="#4A90D9" opacity="0.6" />
                <path d="M 190 298 Q 210 295 230 298" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.7" />

                <rect x="480" y="140" width="120" height="100" fill="#FFFFFF" stroke="#1E2D6B" strokeWidth="2" />
                <polygon points="480,140 540,100 600,140" fill="#1ABC9C" stroke="#1E2D6B" strokeWidth="2" />
                <rect x="380" y="250" width="30" height="30" fill="#1E2D6B" stroke="#000" strokeWidth="2" />
                <line x1="385" y1="255" x2="405" y2="255" stroke="#4A90D9" strokeWidth="1" />
                <line x1="385" y1="260" x2="405" y2="260" stroke="#4A90D9" strokeWidth="1" />
                <line x1="385" y1="265" x2="405" y2="265" stroke="#4A90D9" strokeWidth="1" />
                <line x1="385" y1="270" x2="405" y2="270" stroke="#4A90D9" strokeWidth="1" />
                <rect x="390" y="240" width="15" height="10" fill="#E74C3C" />
                <circle cx="395" cy="245" r="3" fill="#FFFFFF" />
                <rect x="400" y="242" width="8" height="6" fill="#F39C12" />

                <rect x="490" y="230" width="100" height="10" fill="#4A90D9" opacity="0.6" />

                <ellipse cx="475" cy="275" rx="18" ry="12" fill="#8B7355" />
                <circle cx="475" cy="270" r="10" fill="#A0826D" />
                <circle cx="470" cy="268" r="2" fill="#1E2D6B" />
                <circle cx="480" cy="268" r="2" fill="#1E2D6B" />
                <ellipse cx="468" cy="265" rx="5" ry="7" fill="#A0826D" />
                <ellipse cx="482" cy="265" rx="5" ry="7" fill="#A0826D" />
                <circle cx="475" cy="272" r="2" fill="#E74C3C" />
                <line x1="470" y1="273" x2="465" y2="275" stroke="#1E2D6B" strokeWidth="1" />
                <line x1="480" y1="273" x2="485" y2="275" stroke="#1E2D6B" strokeWidth="1" />

                {hazards.map((hazard) => (
                  <g key={hazard.id}>
                    <rect
                      x={hazard.x}
                      y={hazard.y}
                      width={hazard.width}
                      height={hazard.height}
                      fill={
                        found.has(hazard.id)
                          ? realFound.has(hazard.id)
                            ? '#1ABC9C'
                            : '#E74C3C'
                          : 'transparent'
                      }
                      opacity={found.has(hazard.id) ? 0.4 : 0}
                      stroke={found.has(hazard.id) ? (realFound.has(hazard.id) ? '#1ABC9C' : '#E74C3C') : 'none'}
                      strokeWidth="3"
                      className="transition-all duration-300"
                      style={{
                        filter: found.has(hazard.id) && realFound.has(hazard.id) ? 'drop-shadow(0 0 8px #1ABC9C)' : 'none',
                        cursor: revealed ? 'default' : 'pointer'
                      }}
                      onClick={() => findDanger(hazard.id)}
                    />
                  </g>
                ))}
              </svg>

              <div className="absolute top-4 left-4 bg-[#2167AE] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Peligros en casa
              </div>
              <div className="absolute top-4 right-4 bg-[#1E2D6B] text-white px-3 py-1 rounded-full text-sm font-semibold">
                Peligros comunidad
              </div>
            </div>

            <div className="bg-[#ECEEEF] rounded-lg p-6 mb-6">
              <h3 className="font-bold text-[#1E2D6B] mb-3 text-lg">Leyenda de Peligros:</h3>
              <div className="grid grid-cols-2 gap-3">
                {hazards.map((hazard) => (
                  <div
                    key={hazard.id}
                    className={`flex items-center gap-2 p-2 rounded transition-all ${
                      found.has(hazard.id)
                        ? realFound.has(hazard.id)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        : 'bg-white text-gray-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        found.has(hazard.id)
                          ? realFound.has(hazard.id)
                            ? 'bg-[#1ABC9C] text-white'
                            : 'bg-[#E74C3C] text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {hazard.id}
                    </div>
                    <span className="text-sm font-medium">{hazard.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {showFeedback && (
              <div className="bg-[#2167AE] text-white rounded-lg p-6 mb-6">
                <h3 className="font-bold text-xl mb-3">
                  ¡Encontraste {realFound.size} de 8 peligros!
                </h3>
                <p className="text-lg mb-2">
                  Puntaje obtenido: <span className="font-bold">{calculateScore()} puntos</span>
                </p>
                <p className="text-sm leading-relaxed">
                  Estos riesgos no solo afectan la movilidad y la salud, sino que también aumentan la posibilidad de accidentes y enfermedades. Recuerda: mantener los desagües limpios, evitar arrojar basura e informarte sobre zonas seguras.
                </p>
              </div>
            )}

            {showFeedback && (
              <button
                onClick={handleContinue}
                className="w-full py-3 bg-[#1ABC9C] text-white font-bold rounded-lg hover:bg-[#27AE60] transition-colors text-lg"
              >
                Continuar al Mapa
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
