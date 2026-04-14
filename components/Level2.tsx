'use client';

import { useState, useEffect, useRef } from 'react';

interface Level2Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any) => void;
}

const HAZARD_IDS = ['cables', 'vidrios', 'olla', 'basura', 'roedor', 'pisomojado', 'calleinund', 'casabaja'] as const;
type HazardId = typeof HAZARD_IDS[number];

const HAZARD_LABELS: Record<HazardId, string> = {
  cables: 'Cables eléctricos expuestos',
  vidrios: 'Ventana con vidrios rotos',
  olla: 'Olla sin supervisión',
  basura: 'Basura tapando alcantarillas',
  roedor: 'Roedor desplazado por agua',
  pisomojado: 'Piso mojado',
  calleinund: 'Calles inundadas',
  casabaja: 'Vivienda en zona baja',
};

const TIMER_SECONDS = 25;

export default function Level2({ participantId, nickname, onComplete }: Level2Props) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [found, setFound] = useState<Set<HazardId>>(new Set());
  const [finished, setFinished] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch('/nivel2.svg')
      .then(r => r.text())
      .then(text => setSvgContent(text));
  }, []);

  useEffect(() => {
    if (finished || found.size === 8) return;
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
    if (found.size === 8 && !finished) {
      clearInterval(timerRef.current!);
      setFinished(true);
      setTimeout(() => setShowModal(true), 400);
    }
  }, [found]);

  useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;

    const container = svgContainerRef.current;

    const applyHandlers = () => {
      HAZARD_IDS.forEach(id => {
        const el = container.querySelector(`#${id}`) as SVGGElement | null;
        if (!el) return;

        el.style.cursor = 'pointer';
        el.style.transition = 'filter 0.2s';

        el.onmouseenter = () => {
          if (!found.has(id) && !finished) {
            el.style.filter = 'brightness(1.3) drop-shadow(0 0 8px rgba(249,208,48,0.7))';
          }
        };
        el.onmouseleave = () => {
          if (!found.has(id)) {
            el.style.filter = '';
          }
        };
        el.onclick = () => {
          if (!found.has(id) && !finished) {
            setFound(prev => {
              const next = new Set(prev);
              next.add(id);
              return next;
            });
            el.style.outline = 'none';
            Array.from(el.querySelectorAll('*')).forEach((child: Element) => {
              const c = child as SVGElement;
              if (c.getAttribute('stroke') !== null || c.tagName === 'path' || c.tagName === 'polygon' || c.tagName === 'rect' || c.tagName === 'circle') {
                c.setAttribute('stroke', '#F9D030');
                c.setAttribute('stroke-width', '4');
              }
            });
            el.setAttribute('stroke', '#F9D030');
            el.setAttribute('stroke-width', '4');
            el.style.filter = 'drop-shadow(0 0 10px #F9D030)';
            el.onmouseenter = null;
            el.onmouseleave = null;
          }
        };
      });
    };

    applyHandlers();
  }, [svgContent, found, finished]);

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
        ref={svgContainerRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <div
            style={{
              flex: 1,
              height: 10,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 99,
              overflow: 'hidden',
            }}
          >
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
          <span
            style={{
              color: timerColor,
              fontWeight: 800,
              fontSize: 18,
              minWidth: 36,
              textAlign: 'right',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            }}
          >
            {timeLeft}s
          </span>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 20,
            padding: '4px 16px',
            fontWeight: 700,
            fontSize: 13,
            color: '#1E2D6B',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {found.size} de 8 peligros encontrados
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          maxWidth: 180,
        }}
      >
        {HAZARD_IDS.map(id => (
          <div
            key={id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              opacity: found.has(id) ? 1 : 0.55,
              transition: 'opacity 0.3s',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: found.has(id) ? '#F9D030' : 'rgba(255,255,255,0.4)',
                border: '2px solid rgba(255,255,255,0.7)',
                flexShrink: 0,
                boxShadow: found.has(id) ? '0 0 6px #F9D030' : 'none',
                transition: 'all 0.3s',
              }}
            />
            <span
              style={{
                color: '#fff',
                fontSize: 10,
                fontWeight: found.has(id) ? 700 : 400,
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                lineHeight: 1.2,
              }}
            >
              {HAZARD_LABELS[id]}
            </span>
          </div>
        ))}
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
            <div
              style={{
                fontSize: 'clamp(32px, 6vw, 56px)',
                marginBottom: 8,
              }}
            >
              {found.size === 8 ? '🏆' : found.size >= 5 ? '👍' : found.size >= 3 ? '🙂' : '💪'}
            </div>

            <h2
              style={{
                fontSize: 'clamp(18px, 3vw, 26px)',
                fontWeight: 800,
                color: '#1E2D6B',
                marginBottom: 8,
              }}
            >
              {found.size === 8
                ? '¡Excelente! Encontraste todos los peligros'
                : `Encontraste ${found.size} de 8 peligros`}
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

            <p
              style={{
                color: '#444',
                fontSize: 'clamp(12px, 1.8vw, 15px)',
                lineHeight: 1.6,
                marginBottom: 24,
                textAlign: 'left',
              }}
            >
              Estos riesgos no solo afectan la movilidad y la salud, sino que aumentan la posibilidad de accidentes y enfermedades. Recuerda: mantener los desagües limpios, evitar arrojar basura e informarte sobre zonas seguras para tu familia.
            </p>

            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 12,
                padding: '10px 14px',
                marginBottom: 20,
                textAlign: 'left',
              }}
            >
              <p style={{ fontWeight: 700, color: '#1E2D6B', fontSize: 13, marginBottom: 8 }}>
                Peligros encontrados:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {HAZARD_IDS.map(id => (
                  <span
                    key={id}
                    style={{
                      padding: '2px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      background: found.has(id) ? '#F9D030' : '#e0e0e0',
                      color: found.has(id) ? '#333' : '#999',
                    }}
                  >
                    {HAZARD_LABELS[id]}
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
