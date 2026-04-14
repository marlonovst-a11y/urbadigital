'use client';

import { useState, useEffect } from 'react';

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
  const [svgContent, setSvgContent] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    fetch('/nivel4.svg')
      .then(r => r.text())
      .then(text => setSvgContent(text));
  }, []);

  const currentSvg = svgContent
    ? svgContent.replace('TEXTO_ACCION', challenge.pregunta)
    : '';

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

  const getOptionStyle = (option: 'A' | 'B'): React.CSSProperties => {
    if (!showFeedback) {
      if (selectedOption === option) {
        return { background: '#2167AE', color: '#fff', borderColor: '#2167AE', transform: 'scale(1.02)', boxShadow: '0 6px 24px rgba(33,103,174,0.4)' };
      }
      return { background: '#fff', color: '#1E2D6B', borderColor: '#ddd' };
    }
    if (option === challenge.correcta) {
      return { background: '#1ABC9C', color: '#fff', borderColor: '#1ABC9C' };
    }
    if (selectedOption === option && option !== challenge.correcta) {
      return { background: '#E74C3C', color: '#fff', borderColor: '#E74C3C' };
    }
    return { background: '#f5f5f5', color: '#aaa', borderColor: '#ddd', opacity: 0.6 };
  };

  if (!svgContent) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fc854a' }}>
        <div style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>Cargando...</div>
      </div>
    );
  }

  if (showFinalFeedback) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div
          dangerouslySetInnerHTML={{ __html: currentSvg }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
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
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div
        dangerouslySetInnerHTML={{ __html: currentSvg }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '16px 16px 20px',
          background: 'rgba(10, 20, 40, 0.78)',
          backdropFilter: 'blur(6px)',
          borderTop: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
            {challenges.map((_, index) => (
              <div
                key={index}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 13,
                  background: index < currentChallenge ? '#1ABC9C' : index === currentChallenge ? '#2167AE' : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  transform: index === currentChallenge ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s',
                  boxShadow: index === currentChallenge ? '0 0 12px rgba(33,103,174,0.6)' : 'none',
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {(['A', 'B'] as const).map(option => (
              <div
                key={option}
                onClick={() => handleSelectOption(option)}
                style={{
                  position: 'relative',
                  border: '3px solid',
                  borderRadius: 12,
                  padding: '12px 16px',
                  cursor: showFeedback ? 'default' : 'pointer',
                  transition: 'all 0.25s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  ...getOptionStyle(option),
                }}
              >
                {showFeedback && option === challenge.correcta && (
                  <div style={{ position: 'absolute', top: -10, right: -10, background: '#1ABC9C', color: '#fff', fontWeight: 800, fontSize: 11, borderRadius: 99, padding: '2px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    ¡Correcto!
                  </div>
                )}
                {showFeedback && selectedOption === option && option !== challenge.correcta && (
                  <div style={{ position: 'absolute', top: -10, right: -10, background: '#E74C3C', color: '#fff', fontWeight: 800, fontSize: 11, borderRadius: 99, padding: '2px 8px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    Incorrecto
                  </div>
                )}
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  {option}
                </div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 'clamp(12px,1.4vw,14px)', lineHeight: 1.3 }}>
                  {option === 'A' ? challenge.opcionA : challenge.opcionB}
                </p>
              </div>
            ))}
          </div>

          {showFeedback && (
            <div style={{ background: 'rgba(33,103,174,0.9)', borderRadius: 10, padding: '10px 16px', marginBottom: 12 }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 'clamp(12px,1.4vw,14px)', fontWeight: 600, lineHeight: 1.5 }}>
                <strong>{selectedOption === challenge.correcta ? '¡Muy bien! ' : 'Aprende de esto: '}</strong>
                {challenge.mensaje}
              </p>
            </div>
          )}

          {!showFeedback ? (
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              style={{
                width: '100%',
                padding: '12px 0',
                background: selectedOption ? '#2167AE' : 'rgba(255,255,255,0.15)',
                color: selectedOption ? '#fff' : 'rgba(255,255,255,0.4)',
                fontWeight: 800,
                fontSize: 'clamp(13px,1.6vw,16px)',
                borderRadius: 10,
                border: 'none',
                cursor: selectedOption ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              Confirmar respuesta
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                width: '100%',
                padding: '12px 0',
                background: '#1ABC9C',
                color: '#fff',
                fontWeight: 800,
                fontSize: 'clamp(13px,1.6vw,16px)',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(26,188,156,0.4)',
              }}
            >
              {currentChallenge < challenges.length - 1 ? 'Siguiente reto' : 'Ver resultados'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
