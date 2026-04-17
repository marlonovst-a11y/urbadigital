'use client';

import { useState } from 'react';
import Header from './Header';

interface FinalEvaluationProps {
  participantId: string;
  nickname: string;
  onComplete: (responses: { pregunta_1: string; pregunta_2: string; pregunta_3: string }) => void;
}

export default function FinalEvaluation({ participantId, nickname, onComplete }: FinalEvaluationProps) {
  const [answer1, setAnswer1] = useState<string>('');
  const [answer2, setAnswer2] = useState<string>('');
  const [answer3, setAnswer3] = useState<string>('');
  const [step, setStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const handleSubmit = () => {
    if (answer1 && answer2 && answer3) {
      onComplete({ pregunta_1: answer1, pregunta_2: answer2, pregunta_3: answer3 });
    }
  };

  const isComplete = answer1 && answer2 && answer3;

  if (showIntro) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/fondo__evalucion__final.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        <Header />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', gap: 24, maxWidth: 560, width: '90%' }}>
          <img src="/carmen_evalucion__final.png" style={{ width: 'clamp(100px, 12vw, 160px)', flexShrink: 0 }} />
          <div style={{ background: 'white', borderRadius: 16, padding: '20px 28px', border: '3px solid #2167AE', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderRight: '14px solid #2167AE' }} />
            <div style={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '12px solid white' }} />
            <p style={{ margin: '0 0 8px', fontWeight: 800, color: '#1E2D6B', fontSize: 'clamp(16px, 1.8vw, 22px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>
              ¡Evaluación Final!
            </p>
            <p style={{ margin: '0 0 16px', color: '#444', fontSize: 'clamp(12px, 1.3vw, 15px)', lineHeight: 1.5 }}>
              Responde estas <strong>3 preguntas</strong> sobre lo que aprendiste. Esta evaluación vale <strong>10 puntos</strong> que se suman a tu puntaje total. ¡Sé honesto con tus respuestas!
            </p>
            <button onClick={() => setShowIntro(false)} style={{ width: '100%', padding: '12px 0', background: '#1ABC9C', color: 'white', fontWeight: 800, fontSize: 'clamp(14px, 1.5vw, 17px)', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,188,156,0.4)' }}>
              ¡Comenzar! ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      pregunta: '1. ¿Has aprendido algo nuevo de estos consejos, contenidos y materiales?',
      opciones: ['Sí, significativamente', 'Sí, moderadamente', 'Sí, de forma limitada', 'No, en absoluto'],
      value: answer1,
      setter: setAnswer1,
    },
    {
      pregunta: '2. ¿Fue útil la información/contenido que revisaste en la plataforma?',
      opciones: ['Sí, mucho', 'Sí, bastante', 'Sí, poco', 'No, nada'],
      value: answer2,
      setter: setAnswer2,
    },
    {
      pregunta: '3. ¿Piensas aplicar estos consejos?',
      opciones: ['Sí, definitivamente los aplicaré', 'Probablemente los aplicaré', 'Es poco probable que los aplique', 'No los aplicaré'],
      value: answer3,
      setter: setAnswer3,
    },
  ];

  const currentStep = steps[step];

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/fondo__evalucion__final.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
      <Header />

      <div style={{ position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 20 }}>
        {['Pregunta 1', 'Pregunta 2', 'Pregunta 3'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: i < step ? '#1ABC9C' : i === step ? '#2167AE' : 'rgba(255,255,255,0.4)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'white', boxShadow: i === step ? '0 0 16px rgba(33,103,174,0.6), 0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.2)' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 10, color: 'white', fontWeight: i === step ? 700 : 400, opacity: i === step ? 1 : 0.7 }}>{label}</span>
            </div>
            {i < 2 && <div style={{ width: 60, height: 3, background: i < step ? '#1ABC9C' : 'rgba(255,255,255,0.3)', marginBottom: 20, flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: 'clamp(300px, 55vw, 620px)', zIndex: 20 }}>
        <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', borderRadius: 24, padding: '28px 32px', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <h3 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(16px, 1.8vw, 22px)', marginBottom: 20, textShadow: '0 2px 8px rgba(0,0,0,0.4)', lineHeight: 1.4 }}>
            {currentStep.pregunta}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentStep.opciones.map((opcion) => (
              <button key={opcion} onClick={() => currentStep.setter(opcion)}
                style={{
                  padding: '12px 20px', borderRadius: 50, border: '2px solid', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', backdropFilter: 'blur(4px)',
                  fontWeight: currentStep.value === opcion ? 700 : 500,
                  fontSize: 'clamp(13px, 1.4vw, 16px)',
                  ...(currentStep.value === opcion
                    ? { background: 'rgba(33,103,174,0.9)', borderColor: '#2167AE', color: 'white', boxShadow: '0 4px 16px rgba(33,103,174,0.5)', transform: 'translateY(-2px)' }
                    : { background: 'rgba(255,255,255,0.20)', borderColor: 'rgba(255,255,255,0.5)', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' })
                }}
                onMouseEnter={e => { if (currentStep.value !== opcion) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { if (currentStep.value !== opcion) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}>
                {opcion}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, fontSize: 15, borderRadius: 50, border: '2px solid white', cursor: 'pointer' }}>
                ← Anterior
              </button>
            )}
            <button
              onClick={() => { if (step < 2) setStep(step + 1); else handleSubmit(); }}
              disabled={!currentStep.value}
              style={{
                flex: 2, padding: '12px 0', fontWeight: 900, fontSize: 15, borderRadius: 50, border: 'none', cursor: currentStep.value ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                ...(currentStep.value
                  ? step === 2
                    ? { background: '#DB4E5B', color: 'white', boxShadow: '0 4px 16px rgba(219,78,91,0.5)' }
                    : { background: '#C1D94C', color: '#1E2D6B', boxShadow: '0 4px 16px rgba(193,217,76,0.5)' }
                  : { background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', boxShadow: 'none' })
              }}>
              {step === 2 ? 'Ver mi puntaje final 🏆' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
