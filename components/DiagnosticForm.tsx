'use client';

import { useState } from 'react';

interface DiagnosticFormProps {
  onComplete: (data: DiagnosticData) => void;
}

export interface DiagnosticData {
  edad: string;
  genero: string;
  ocupacion: string;
}

const ageOptions = ['16-18 años', '19-26 años', '27-35 años', '35 años en adelante'];
const genderOptions = ['Masculino', 'Femenino', 'Otro'];
const occupationOptions = ['Estudiante', 'Desempleado', 'Funcionario Público', 'Empleado del sector privado', 'Otro'];

const steps = [
  {
    field: 'edad' as keyof DiagnosticData,
    question: '¿Cuál es tu edad?',
    options: ageOptions,
    label: 'Tu edad',
    character: '/carmen.png',
  },
  {
    field: 'genero' as keyof DiagnosticData,
    question: '¿Cuál es tu género?',
    options: genderOptions,
    label: 'Tu género',
    character: '/roberto.png',
  },
  {
    field: 'ocupacion' as keyof DiagnosticData,
    question: '¿Cuál es tu ocupación?',
    options: occupationOptions,
    label: 'Tu ocupación',
    character: '/manuel.png',
  },
];

const stepLabels = ['Tu edad', 'Tu género', 'Tu ocupación'];

export default function DiagnosticForm({ onComplete }: DiagnosticFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DiagnosticData>({
    edad: '',
    genero: '',
    ocupacion: ''
  });

  const handleSelect = (field: keyof DiagnosticData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const currentStep = steps[step];
  const currentValue = data[currentStep.field];
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (!currentValue) return;
    if (isLast) {
      onComplete(data);
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/fondo_preguntas.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: i < step ? '#1ABC9C' : i === step ? '#2167AE' : 'white',
                  color: i <= step ? 'white' : '#aaa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 18,
                  border: '3px solid',
                  borderColor: i <= step ? 'transparent' : '#ddd',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: 11,
                  color: i === step ? 'white' : 'rgba(255,255,255,0.6)',
                  fontWeight: i === step ? 700 : 400,
                }}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  width: 80,
                  height: 3,
                  background: i < step ? '#1ABC9C' : 'rgba(255,255,255,0.3)',
                  marginBottom: 22,
                  flexShrink: 0,
                  transition: 'background 0.3s ease',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Character + question bubble */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <img
            src={currentStep.character}
            alt="personaje"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: -10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '10px solid white',
            }} />
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: '12px 16px',
              fontWeight: 700,
              fontSize: 15,
              color: '#1E2D6B',
              boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
              lineHeight: 1.4,
            }}>
              {currentStep.question}
            </div>
          </div>
        </div>

        {/* Options */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginBottom: 24,
        }}>
          {currentStep.options.map(option => (
            <button
              key={option}
              onClick={() => handleSelect(currentStep.field, option)}
              style={{
                background: currentValue === option ? '#2167AE' : 'rgba(255,255,255,0.85)',
                color: currentValue === option ? 'white' : '#333',
                border: `2px solid ${currentValue === option ? '#2167AE' : 'transparent'}`,
                borderRadius: 50,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                transform: currentValue === option ? 'scale(1.02)' : 'scale(1)',
                boxShadow: currentValue === option ? '0 4px 12px rgba(33,103,174,0.35)' : '0 2px 6px rgba(0,0,0,0.08)',
              }}
              onMouseEnter={e => {
                if (currentValue !== option) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,1)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#2167AE';
                }
              }}
              onMouseLeave={e => {
                if (currentValue !== option) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.85)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                }
              }}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Next button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNext}
            disabled={!currentValue}
            style={{
              background: currentValue ? '#1ABC9C' : 'rgba(255,255,255,0.3)',
              color: currentValue ? 'white' : 'rgba(255,255,255,0.5)',
              border: 'none',
              borderRadius: 50,
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: 16,
              cursor: currentValue ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: currentValue ? '0 4px 14px rgba(26,188,156,0.4)' : 'none',
            }}
          >
            {isLast ? '¡Comenzar el juego! 🎮' : 'Siguiente →'}
          </button>
        </div>

      </div>
    </div>
  );
}
