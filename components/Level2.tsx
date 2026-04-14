'use client';

import { useState, useEffect, useRef } from 'react';

interface Level2Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any) => void;
}

const TIMER_SECONDS = 25;

const peligros = [
  { id: 'cables',     label: 'Cables eléctricos expuestos',    left: '51.7%', top: '33.0%', width: '10%', height: '8%' },
  { id: 'vidrios',    label: 'Ventana con vidrios rotos',       left: '22.7%', top: '38.5%', width: '6%',  height: '8%' },
  { id: 'olla',       label: 'Olla sin supervisión',            left: '68.3%', top: '38.1%', width: '6%',  height: '8%' },
  { id: 'basura',     label: 'Basura tapando alcantarillas',    left: '31.9%', top: '52.1%', width: '6%',  height: '8%' },
  { id: 'roedor',     label: 'Roedor desplazado por agua',      left: '25.3%', top: '56.5%', width: '6%',  height: '8%' },
  { id: 'pisomojado', label: 'Piso mojado',                     left: '60.0%', top: '55.1%', width: '8%',  height: '8%' },
  { id: 'calleinund', label: 'Calles inundadas',                left: '47.7%', top: '58.7%', width: '10%', height: '8%' },
  { id: 'casabaja',   label: 'Vivienda en zona baja',           left: '46.1%', top: '52.9%', width: '8%',  height: '8%' },
];

type HazardId = typeof peligros[number]['id'];

export default function Level2({ participantId, nickname, onComplete }: Level2Props) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [found, setFound] = useState<Set<HazardId>>(new Set());
  const [finished, setFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (finished || found.size === peligros.length) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
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
      setTimeout(() => setShowModal(true), 400);
    }
  }, [found]);

  const handleFindHazard = (id: HazardId) => {
    if (found.has(id) || finished) return;
    setFound(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`[calibración] left: '${x.toFixed(1)}%', top: '${y.toFixed(1)}%'`);
  };

  const calculateScore = () => {
    const count = found.size;
    if (count === 8) return 20;
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

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#1a2a4a' }}>
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src="/nivel2.svg"
            alt="nivel 2"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />

          {peligros.map(p => (
            <div
              key={p.id}
              onClick={e => { e.stopPropagation(); handleFindHazard(p.id); }}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                width: p.width,
                height: p.height,
                border: found.has(p.id) ? '3px solid yellow' : '2px solid red',
                background: found.has(p.id) ? 'rgba(255,255,0,0.3)' : 'rgba(255,0,0,0.3)',
                cursor: found.has(p.id) || finished ? 'default' : 'pointer',
                boxSizing: 'border-box',
                zIndex: 10,
              }}
              title={p.label}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 12,
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
        <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 20, padding: '4px 16px', fontWeight: 700, fontSize: 13, color: '#1E2D6B', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {found.size} de 8 peligros encontrados
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: 'rgba(10, 20, 40, 0.82)',
          backdropFilter: 'blur(6px)',
          padding: '10px 16px 12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', maxWidth: 900, margin: '0 auto' }}>
          {peligros.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: found.has(p.id) ? '#F9D030' : 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.4)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: found.has(p.id) ? '0 0 8px #F9D030' : 'none',
                  transition: 'all 0.3s',
                  fontSize: 13,
                  fontWeight: 800,
                  color: found.has(p.id) ? '#333' : 'transparent',
                }}
              >
                {found.has(p.id) ? '✓' : ''}
              </div>
              <span
                style={{
                  color: found.has(p.id) ? '#F9D030' : 'rgba(255,255,255,0.75)',
                  fontSize: 14,
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
              {found.size === 8 ? '🏆' : found.size >= 5 ? '👍' : found.size >= 3 ? '🙂' : '💪'}
            </div>
            <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 800, color: '#1E2D6B', marginBottom: 8 }}>
              {found.size === 8 ? '¡Excelente! Encontraste todos los peligros' : `Encontraste ${found.size} de 8 peligros`}
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
