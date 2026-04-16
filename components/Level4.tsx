'use client';

import { useState, memo } from 'react';
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
  emojiA: string;
  emojiB: string;
  imagenA: string;
  imagenB: string;
  correcta: 'A' | 'B';
  mensaje: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    pregunta: '¿Qué imagen ayuda más al planeta?',
    opcionA: 'Bombilla apagada / luz natural',
    opcionB: 'Casa con luces encendidas de día',
    emojiA: '💡',
    emojiB: '🏠',
    imagenA: '/r1a.png',
    imagenB: '/r1b.png',
    correcta: 'A',
    mensaje: 'Reducir el consumo de energía disminuye las emisiones de gases contaminantes.'
  },
  {
    id: 2,
    pregunta: 'Selecciona la mejor imagen:',
    opcionA: 'Agua corriendo sin uso',
    opcionB: 'Persona cerrando la llave',
    emojiA: '🚿',
    emojiB: '🤲',
    imagenA: '/r2a.png',
    imagenB: '/r2b.png',
    correcta: 'B',
    mensaje: 'Ahorrar agua es clave frente a sequías.'
  },
  {
    id: 3,
    pregunta: '¿Qué imagen cuida más el planeta?',
    opcionA: 'Persona caminando o en bicicleta',
    opcionB: 'Auto emitiendo humo',
    emojiA: '🚲',
    emojiB: '🚗',
    imagenA: '/r3a.png',
    imagenB: '/r3b.png',
    correcta: 'A',
    mensaje: 'El transporte sostenible reduce la contaminación del aire.'
  },
  {
    id: 4,
    pregunta: 'Elige la imagen correcta:',
    opcionA: 'Basura en ríos o calles',
    opcionB: 'Separación de residuos y reciclaje',
    emojiA: '🗑️',
    emojiB: '♻️',
    imagenA: '/r4a.png',
    imagenB: '/r4b.png',
    correcta: 'B',
    mensaje: 'La mala gestión de residuos agrava la contaminación ambiental.'
  },
  {
    id: 5,
    pregunta: '¿Qué imagen representa una buena decisión?',
    opcionA: 'Compra consciente y productos reutilizables',
    opcionB: 'Consumo excesivo y desechables',
    emojiA: '🛍️',
    emojiB: '🛒',
    imagenA: '/r5a.png',
    imagenB: '/r5b.png',
    correcta: 'A',
    mensaje: 'Consumir solo lo necesario reduce la presión sobre el planeta.'
  }
];

const SVGBackground = memo(({ svgContent }: { svgContent: string }) => (
  <div
    dangerouslySetInnerHTML={{ __html: svgContent }}
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
  />
));
SVGBackground.displayName = 'SVGBackground';

export default function Level4({ participantId, nickname, onComplete }: Level4Props) {
  const [showInstructions, setShowInstructions] = useState(true);
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
    setResponses(prev => [...prev, response]);
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

  const calculateScore = (r = responses) => r.reduce((acc: number, x: any) => acc + x.puntos, 0);

  const handleContinue = () => {
    onComplete(calculateScore(), responses);
  };

  const getCardStyle = (option: 'A' | 'B'): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'relative',
      background: 'transparent',
      border: 'none',
      borderRadius: 16,
      padding: '14px 18px',
      cursor: showFeedback ? 'default' : 'pointer',
      transition: 'all 0.25s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      textAlign: 'center',
      minWidth: 160,
      flex: 1,
    };
    if (!showFeedback) {
      if (selectedOption === option) {
        return { ...base, transform: 'scale(1.06)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' };
      }
      return base;
    }
    if (option === challenge.correcta) {
      return { ...base, transform: 'scale(1.06)', filter: 'drop-shadow(0 4px 12px rgba(26,188,156,0.5))' };
    }
    if (selectedOption === option) {
      return { ...base, opacity: 0.7, filter: 'drop-shadow(0 4px 12px rgba(231,76,60,0.4))' };
    }
    return { ...base, opacity: 0.5 };
  };

  if (showInstructions) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/nivel4_instruccion.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        <Header />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: 24 }}>
          <img src="/manuel_nivel4.png" style={{ width: 'clamp(120px, 15vw, 200px)' }} />
          <div style={{ background: 'white', borderRadius: 16, padding: '20px 28px', maxWidth: 420, border: '3px solid #2167AE', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderRight: '14px solid #2167AE' }} />
            <div style={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '12px solid white' }} />
            <p style={{ margin: '0 0 8px', fontWeight: 800, color: '#1E2D6B', fontSize: 'clamp(14px, 1.6vw, 18px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>
              ¡Nivel 4 — Reto Ambiental!
            </p>
            <p style={{ margin: '0 0 16px', color: '#444', fontSize: 'clamp(12px, 1.3vw, 15px)', lineHeight: 1.5 }}>
              Don Manuel te guiará. Observa las <strong>2 imágenes</strong> y elige la que representa una mejor decisión para el planeta. ¡Tienes 5 retos para completar!
            </p>
            <button onClick={() => setShowInstructions(false)} style={{ width: '100%', padding: '12px 0', background: '#1ABC9C', color: 'white', fontWeight: 800, fontSize: 'clamp(14px, 1.5vw, 17px)', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,188,156,0.4)' }}>
              ¡Comenzar! 🌿
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showFinalFeedback) {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', backgroundImage: 'url(/nivel4_fondo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,4vw,40px)', maxWidth: 560, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#1E2D6B', marginBottom: 8 }}>
              ¡Completaste el Reto de Respuesta Rápida!
            </h2>
            <div style={{ display: 'inline-block', background: '#2167AE', color: '#fff', fontWeight: 800, fontSize: 'clamp(16px,2.5vw,22px)', borderRadius: 12, padding: '8px 24px', marginBottom: 16 }}>
              {calculateScore()} de 20 puntos
            </div>
            <p style={{ color: '#444', fontSize: 'clamp(12px,1.6vw,15px)', lineHeight: 1.6, marginBottom: 20 }}>
              Cada decisión responsable con el ambiente suma. Reducir el consumo, ahorrar agua, usar transporte sostenible, reciclar y consumir conscientemente son acciones que protegen nuestro planeta y reducen los riesgos climáticos.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {responses.map((response, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `2px solid ${response.correcta ? '#1ABC9C' : '#E74C3C'}`,
                    background: response.correcta ? '#f0fdf9' : '#fff5f5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: response.correcta ? '#1ABC9C' : '#E74C3C', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {response.correcta ? (
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="white"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="white"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: '#1E2D6B', fontSize: 13, margin: 0 }}>{response.reto}</p>
                    <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Tu respuesta: <strong>{response.opcion_elegida}</strong></p>
                  </div>
                  <div style={{ fontWeight: 800, color: '#1E2D6B', fontSize: 15 }}>{response.puntos} pts</div>
                </div>
              ))}
            </div>
            <button
              onClick={handleContinue}
              style={{ width: '100%', padding: '14px 0', background: '#1ABC9C', color: '#fff', fontWeight: 800, fontSize: 'clamp(14px,2vw,18px)', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,188,156,0.4)' }}
            >
              Continuar al Mapa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/nivel4_fondo.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
      <Header />

      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(280px, 45vw, 580px)', zIndex: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '18px 28px', border: '3px solid #1E2D6B', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '16px solid #1E2D6B' }} />
          <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '13px solid white' }} />
          <p style={{ margin: 0, color: '#1E2D6B', fontWeight: 700, fontSize: 'clamp(18px, 2.2vw, 30px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif', lineHeight: 1.3 }}>
            {challenge.pregunta}
          </p>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(300px, 65vw, 780px)', display: 'flex', gap: 20, zIndex: 20 }}>
        {(['A', 'B'] as const).map(option => (
          <div key={option} onClick={() => handleSelectOption(option)} style={getCardStyle(option)}>
            {showFeedback && option === challenge.correcta && (
              <div style={{ position: 'absolute', top: -12, right: -12, background: '#1ABC9C', color: '#fff', fontWeight: 800, fontSize: 11, borderRadius: 99, padding: '3px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>¡Correcto!</div>
            )}
            {showFeedback && selectedOption === option && option !== challenge.correcta && (
              <div style={{ position: 'absolute', top: -12, right: -12, background: '#E74C3C', color: '#fff', fontWeight: 800, fontSize: 11, borderRadius: 99, padding: '3px 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Incorrecto</div>
            )}
            <img
              src={option === 'A' ? challenge.imagenA : challenge.imagenB}
              alt={option === 'A' ? challenge.opcionA : challenge.opcionB}
              style={{ width: '100%', maxWidth: 200, height: 160, objectFit: 'contain', borderRadius: 8 }}
            />
            <div style={{ background: 'white', borderRadius: 50, padding: '6px 18px', border: '2px solid #1E2D6B', marginTop: 8, fontWeight: 700, fontSize: 'clamp(11px, 1.2vw, 14px)', color: '#1E2D6B', lineHeight: 1.2, textAlign: 'center', maxWidth: 200 }}>
              {option === 'A' ? challenge.opcionA : challenge.opcionB}
            </div>
          </div>
        ))}
      </div>

      {showFeedback && (
        <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(280px, 60vw, 700px)', zIndex: 20, background: 'rgba(10,20,40,0.75)', backdropFilter: 'blur(6px)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 'clamp(12px, 1.4vw, 15px)', fontWeight: 600, lineHeight: 1.5 }}>
            <strong>{selectedOption === challenge.correcta ? '¡Muy bien! ' : 'Aprende de esto: '}</strong>{challenge.mensaje}
          </p>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)', width: 'clamp(200px, 30vw, 360px)', zIndex: 20 }}>
        {!showFeedback ? (
          <button onClick={handleConfirm} disabled={!selectedOption} style={{ width: '100%', padding: '12px 0', background: selectedOption ? '#2167AE' : 'rgba(30,45,107,0.75)', color: selectedOption ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: 800, fontSize: 'clamp(13px,1.6vw,16px)', borderRadius: 12, border: 'none', cursor: selectedOption ? 'pointer' : 'not-allowed', backdropFilter: 'blur(4px)' }}>
            Confirmar respuesta
          </button>
        ) : (
          <button onClick={handleNext} style={{ width: '100%', padding: '12px 0', background: '#1ABC9C', color: '#fff', fontWeight: 800, fontSize: 'clamp(13px,1.6vw,16px)', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,188,156,0.4)' }}>
            {currentChallenge < challenges.length - 1 ? 'Siguiente reto' : 'Ver resultados'}
          </button>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 16, zIndex: 20 }}>
        {challenges.map((_, idx) => (
          <div key={idx} style={{ width: 52, height: 52, borderRadius: '50%', background: idx < currentChallenge ? (responses[idx]?.correcta ? '#1ABC9C' : '#E74C3C') : idx === currentChallenge ? '#F9D030' : 'rgba(255,255,255,0.3)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: idx === currentChallenge ? '#1E2D6B' : 'white', fontFamily: 'RobotRadicals, sans-serif', transition: 'all 0.3s', transform: idx === currentChallenge ? 'scale(1.2)' : 'scale(1)' }}>
            {idx < currentChallenge ? (responses[idx]?.correcta ? '✓' : '✗') : idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
