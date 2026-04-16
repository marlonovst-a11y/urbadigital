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
    cols: 'grid-cols-2',
  },
  {
    field: 'genero' as keyof DiagnosticData,
    question: '¿Cuál es tu género?',
    options: genderOptions,
    cols: 'grid-cols-3',
  },
  {
    field: 'ocupacion' as keyof DiagnosticData,
    question: '¿Cuál es tu ocupación?',
    options: occupationOptions,
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
        backgroundImage: 'url(/inicio.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex gap-3 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{ backgroundColor: i === step ? '#F5C400' : 'rgba(255,255,255,0.5)' }}
            />
          ))}
        </div>

        <div className="w-full max-w-md flex flex-col items-center gap-5">
          <img src="/mama.svg" alt="Carmen" className="h-40 drop-shadow-lg" />

          <div
            className="relative px-5 py-4 rounded-2xl text-center shadow-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '14px solid rgba(255,255,255,0.92)',
              }}
            />
            <p className="text-[#1E2D6B] font-bold text-base md:text-lg">
              {currentStep.question}
            </p>
          </div>

          <div className={`w-full grid ${currentStep.cols} gap-3`}>
            {currentStep.options.map(option => (
              <button
                key={option}
                onClick={() => handleSelect(currentStep.field, option)}
                className={`px-4 py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base min-h-[48px] shadow ${
                  currentValue === option
                    ? 'bg-[#2167AE] text-white scale-105'
                    : 'bg-white/80 text-gray-800 hover:bg-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!currentValue}
            className={`w-full mt-2 font-bold py-3 px-6 rounded-full transition-all duration-300 text-base min-h-[48px] shadow-lg ${
              currentValue
                ? 'bg-[#2167AE] text-white hover:bg-[#1E2D6B] active:scale-95'
                : 'bg-white/40 text-white/60 cursor-not-allowed'
            }`}
          >
            {isLast ? 'Comenzar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
