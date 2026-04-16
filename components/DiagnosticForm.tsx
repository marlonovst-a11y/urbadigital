'use client';

import { useState } from 'react';
import Header from './Header';

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
    cols: 'grid-cols-2',
  },
  {
    field: 'genero' as keyof DiagnosticData,
    question: '¿Cuál es tu género?',
    options: genderOptions,
    label: 'Tu género',
    cols: 'grid-cols-3',
  },
  {
    field: 'ocupacion' as keyof DiagnosticData,
    question: '¿Cuál es tu ocupación?',
    options: occupationOptions,
    label: 'Tu ocupación',
    cols: 'grid-cols-1 sm:grid-cols-2',
  },
];

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
        overflow: 'hidden',
      }}
    >
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          {/* Progress bar */}
          <div className="flex items-start justify-center mb-8">
            {steps.map((s, i) => {
              const isCompleted = i < step;
              const isActive = i === step;
              return (
                <div key={i} className="flex items-start">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all duration-300"
                      style={{
                        backgroundColor: isCompleted ? '#1ABC9C' : isActive ? '#2167AE' : 'white',
                        color: isCompleted || isActive ? 'white' : '#9CA3AF',
                      }}
                    >
                      {isCompleted ? '✓' : i + 1}
                    </div>
                    <span
                      className="mt-2 text-xs font-semibold text-center whitespace-nowrap"
                      style={{ color: isActive ? '#1E2D6B' : isCompleted ? '#1ABC9C' : 'rgba(255,255,255,0.8)' }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="mt-5 transition-all duration-500"
                      style={{
                        width: '80px',
                        height: '3px',
                        backgroundColor: i < step ? '#2167AE' : '#D1D5DB',
                        marginLeft: '4px',
                        marginRight: '4px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card */}
          <div
            className="rounded-2xl shadow-xl overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
          >
            {/* Carmen + bocadillo */}
            <div className="flex items-start gap-4 px-6 pt-6 pb-4">
              <img src="/mama.svg" alt="Carmen" className="h-20 flex-shrink-0 drop-shadow" />
              <div className="relative mt-2">
                <div
                  className="absolute -left-3 top-4 w-0 h-0"
                  style={{
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderRight: '12px solid #2167AE',
                  }}
                />
                <div className="bg-[#2167AE] text-white px-4 py-3 rounded-2xl rounded-tl-none shadow text-sm md:text-base font-semibold leading-snug">
                  {currentStep.question}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className={`grid ${currentStep.cols} gap-3 mb-6`}>
                {currentStep.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleSelect(currentStep.field, option)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-sm md:text-base min-h-[48px] border-2 ${
                      currentValue === option
                        ? 'bg-[#2167AE] text-white border-[#2167AE] scale-105 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#2167AE] hover:text-[#2167AE]'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!currentValue}
                  className={`font-bold py-3 px-8 rounded-xl transition-all duration-200 text-base min-h-[48px] shadow-lg ${
                    currentValue
                      ? 'bg-[#2167AE] text-white hover:bg-[#1E2D6B] active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLast ? 'Comenzar el juego 🎮' : 'Siguiente →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
