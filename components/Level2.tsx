'use client';

import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import { useSound } from '@/hooks/useSound';

interface Level2Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any) => void;
}

const TIMER_SECONDS = 25;

const peligros = [
  { id: 'cables',      label: 'Cables sueltos o rotos',          x: 1080, y: 149, w: 51,  h: 97  },
  { id: 'vidrios',     label: 'Ventanas con vidrios rotos',       x: 465,  y: 327, w: 51,  h: 46  },
  { id: 'olla',        label: 'Olla encendida sin supervisión',   x: 1346, y: 311, w: 51,  h: 46  },
  { id: 'basura',      label: 'Basura acumulada',                 x: 616,  y: 648, w: 145, h: 110 },
  { id: 'roedor',      label: 'Roedor',                          x: 505,  y: 759, w: 92,  h: 110 },
  { id: 'pisomojado',  label: 'Piso mojado',                     x: 1112, y: 763, w: 218, h: 55  },
  { id: 'calleinund',  label: 'Calle inundada',                  x: 750,  y: 838, w: 421, h: 102 },
  { id: 'casabaja',    label: 'Casa baja en riesgo',             x: 840,  y: 578, w: 230, h: 230 },
];

type HazardId = typeof peligros[number]['id'];

export default function Level2({ participantId, nickname, onComplete }: Level2Props) {
  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [found, setFound] = useState<Set<HazardId>>(new Set());
  const [finished, setFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { play } = useSound();

  useEffect(() => {
    if (finished || found.size === peligros.length) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          play('timeup');
          setTimeout(() => setShowModal(true), 400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [finished]);

  useEffect(() => {
    if (found.size === peligros.length && !finished) {
      clearInterval(timerRef.current!);
      setFinished(true);
      play('complete');
      setTimeout(() => setShowModal(true), 400);
    }
  }, [found]);

  const handleFindHazard = (id: HazardId) => {
    if (found.has(id) || finished) return;
    play('found');
    setFound(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const calculateScore = () => {
    const count = found.size;
    if (count === peligros.length) return 20;
    if (count >= 5) return 15;
    if (count >= 3) return 10;
    if (count >= 1) return 5;
    return 0;
  };

  const handleContinue = () => {
    const score = calculateScore();
    onComplete(score, {
      encontrados: found.size,
      peligros_encontrados: Array.from(found),
      tiempo: TIMER_SECONDS - timeLeft,
      puntos: score,
    });
  };

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor = timeLeft > 15 ? '#1ABC9C' : timeLeft > 8 ? '#F39C12' : '#E74C3C';

  if (showInstructions) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        backgroundImage: 'url(/nivel2_instruccion.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        <Header />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex', alignItems: 'center', gap: 24
        }}>
          <img src="/sofia_nivel2.png" style={{ width: 'clamp(120px, 15vw, 200px)' }} />
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
              ¡Nivel 2 — Identifica el Riesgo!
            </p>
            <p style={{ margin: '0 0 16px', color: '#444', fontSize: 'clamp(12px, 1.3vw, 15px)', lineHeight: 1.5 }}>
              Sofía te guiará. Tienes <strong>25 segundos</strong> para encontrar los <strong>8 peligros</strong> escondidos en la escena. ¡Haz clic sobre cada peligro que encuentres!
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
              ¡Comenzar! 🔍
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#1a2a4a' }}>
      <Header />

      {/* Imagen SVG — empieza debajo del Header (48px) y termina antes de la barra de peligros (100px) */}
      <div style={{ position: 'absolute', top: 48, left: 0, right: 0, bottom: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src="/nivel2_cuadrado.svg"
            alt="nivel 2"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />

          <svg
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            {peligros.map(p => (
              <rect
                key={p.id}
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                fill={found.has(p.id) ? 'yellow' : 'transparent'}
                fillOpacity={found.has(p.id) ? 0.4 : 0}
                stroke={found.has(p.id) ? 'yellow' : 'transparent'}
                strokeWidth={found.has(p.id) ? 4 : 0}
                style={{ cursor: found.has(p.id) || finished ? 'default' : 'pointer' }}
                onClick={() => handleFindHazard(p.id)}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Timer — debajo del Header */}
      <div
        style={{
          position: 'absolute',
          top: 58,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          width: 'clamp(280px, 50vw, 520px)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 99, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${timerPercent}%`,
                background: timerColor,
                borderRadius: 99,
                transition: 'width 1s linear, background 0.5s',
              }}
            />
          </div>
          <span style={{ color: timerColor, fontWeight: 800, fontSize: 18, minWidth: 36, textAlign: 'right', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            {timeLeft}s
          </span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 20, padding: '4px 16px', fontWeight: 700, fontSize: 13, color: '#1E2D6B', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', marginTop: 4 }}>
          {found.size} de {peligros.length} peligros encontrados
        </div>
      </div>

      {/* Barra de peligros — parte inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: 'rgba(10, 20, 40, 0.82)',
          backdropFilter: 'blur(6px)',
          padding: '6px 12px 8px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', maxWidth: 900, margin: '0 auto' }}>
          {peligros.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: found.has(p.id) ? '#F9D030' : 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: found.has(p.id) ? '0 0 8px #F9D030' : 'none',
                  transition: 'all 0.3s',
                  fontSize: 11,
                  fontWeight: 800,
                  color: found.has(p.id) ? '#333' : 'transparent',
                }}
              >
                {found.has(p.id) ? '✓' : ''}
              </div>
              <span
                style={{
                  color: found.has(p.id) ? '#F9D030' : 'rgba(255,255,255,0.75)',
                  fontSize: 12,
                  fontWeight: found.has(p.id) ? 700 : 400,
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                  lineHeight: 1.3,
                  transition: 'color 0.3s',
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de resultados */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 'clamp(20px, 4vw, 40px)',
              maxWidth: 500,
              width: '100%',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 'clamp(32px, 6vw, 56px)', marginBottom: 8 }}>
              {found.size === peligros.length ? '🏆' : found.size >= 5 ? '👍' : found.size >= 3 ? '🙂' : '💪'}
            </div>
            <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 800, color: '#1E2D6B', marginBottom: 8 }}>
              {found.size === peligros.length ? '¡Excelente! Encontraste todos los peligros' : `Encontraste ${found.size} de ${peligros.length} peligros`}
            </h2>
            <div
              style={{
                display: 'inline-block',
                background: '#2167AE',
                color: '#fff',
                fontWeight: 800,
                fontSize: 'clamp(14px, 2.5vw, 20px)',
                borderRadius: 12,
                padding: '6px 20px',
                marginBottom: 16,
              }}
            >
              {calculateScore()} puntos
            </div>
            <p style={{ color: '#444', fontSize: 'clamp(12px, 1.8vw, 15px)', lineHeight: 1.6, marginBottom: 24, textAlign: 'left' }}>
              Estos riesgos no solo afectan la movilidad y la salud, sino que aumentan la posibilidad de accidentes y enfermedades. Recuerda: mantener los desagües limpios, evitar arrojar basura e informarte sobre zonas seguras para tu familia.
            </p>
            <div style={{ background: '#f5f5f5', borderRadius: 12, padding: '10px 14px', marginBottom: 20, textAlign: 'left' }}>
              <p style={{ fontWeight: 700, color: '#1E2D6B', fontSize: 13, marginBottom: 8 }}>Peligros encontrados:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {peligros.map(p => (
                  <span
                    key={p.id}
                    style={{
                      padding: '2px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      background: found.has(p.id) ? '#F9D030' : '#e0e0e0',
                      color: found.has(p.id) ? '#333' : '#999',
                    }}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={handleContinue}
              style={{
                width: '100%',
                padding: '14px 0',
                background: '#1ABC9C',
                color: '#fff',
                fontWeight: 800,
                fontSize: 'clamp(14px, 2vw, 18px)',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.02em',
                boxShadow: '0 4px 16px rgba(26,188,156,0.4)',
              }}
            >
              Continuar al Mapa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
