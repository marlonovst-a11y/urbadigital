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

const backgrounds = [
  'url(/fondo_preguntas.png)',
  'url(/fondo_2.png)',
  'url(/fondo_3.png)',
];

const characters = ['/carmen.png', '/roberto.png', '/manuel.png'];

const stepLabels = ['Tu edad', 'Tu género', 'Tu ocupación'];

const questions = ['¿Cuál es tu edad?', '¿Cuál es tu género?', '¿Cuál es tu ocupación?'];

const optionsByStep = [ageOptions, genderOptions, occupationOptions];

const fields: (keyof DiagnosticData)[] = ['edad', 'genero', 'ocupacion'];

export default function DiagnosticForm({ onComplete }: DiagnosticFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<DiagnosticData>({
    edad: '',
    genero: '',
    ocupacion: '',
  });

  const handleSelect = (field: keyof DiagnosticData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const currentField = fields[step];
  const currentValue = data[currentField];
  const isLast = step === 2;

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
        minHeight: '100vh',
        backgroundImage: backgrounds[step],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        boxSizing: 'border-box',
        transition: 'background-image 0.4s ease',
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: i < step ? '#1ABC9C' : i === step ? '#2167AE' : 'rgba(255,255,255,0.6)',
                  color: i <= step ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 18,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: 11,
                  color: i === step ? 'white' : 'rgba(255,255,255,0.6)',
                  fontWeight: i === step ? 700 : 400,
                  whiteSpace: 'nowrap',
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

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: 24,
          padding: 32,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}>
          {/* Character + bubble */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <img
              src={characters[step]}
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
            <div style={{ position: 'relative', flex: 1 }}>
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
                padding: '12px 18px',
                fontWeight: 700,
                fontSize: 15,
                color: '#1E2D6B',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                lineHeight: 1.4,
              }}>
                {questions[step]}
              </div>
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {optionsByStep[step].map(option => (
              <button
                key={option}
                onClick={() => handleSelect(currentField, option)}
                style={{
                  background: currentValue === option ? '#2167AE' : 'rgba(255,255,255,0.85)',
                  color: currentValue === option ? 'white' : '#333',
                  border: '2px solid transparent',
                  borderRadius: 50,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  transform: currentValue === option ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: currentValue === option
                    ? '0 4px 12px rgba(33,103,174,0.4)'
                    : '0 2px 6px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={e => {
                  if (currentValue !== option) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,1)';
                  }
                }}
                onMouseLeave={e => {
                  if (currentValue !== option) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.85)';
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
                background: '#1E2D6B',
                color: 'white',
                fontWeight: 800,
                fontSize: 16,
                borderRadius: 50,
                padding: '14px 48px',
                border: '3px solid white',
                cursor: currentValue ? 'pointer' : 'not-allowed',
                opacity: currentValue ? 1 : 0.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                letterSpacing: '0.03em',
              }}
            >
              {isLast ? '¡Comenzar! 🎮' : 'Siguiente →'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
