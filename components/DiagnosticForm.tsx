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

export default function DiagnosticForm({ onComplete }: DiagnosticFormProps) {
  const [data, setData] = useState<DiagnosticData>({
    edad: '',
    genero: '',
    ocupacion: ''
  });

  const isComplete = data.edad && data.genero && data.ocupacion;

  const handleSelect = (field: keyof DiagnosticData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    if (isComplete) {
      onComplete(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ECEEEF]">
      <Header />

      <main className="pt-24 flex-1 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex-shrink-0">
                <img src="/mama.svg" alt="Carmen" style={{ height: '150px' }} />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Hola, soy Carmen, la mamá</p>
                <p className="text-gray-600 text-sm mt-1">
                  Antes de comenzar, queremos conocerte mejor. Responde estas preguntas rápidas.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-lg font-bold text-[#1E2D6B] mb-4">
                  Pregunta 1: ¿Cuál es tu edad?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ageOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleSelect('edad', option)}
                      className={`px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                        data.edad === option
                          ? 'bg-[#2167AE] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-[#1E2D6B] mb-4">
                  Pregunta 2: ¿Cuál es tu género?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {genderOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleSelect('genero', option)}
                      className={`px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                        data.genero === option
                          ? 'bg-[#2167AE] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-[#1E2D6B] mb-4">
                  Pregunta 3: ¿Cuál es tu ocupación?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {occupationOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleSelect('ocupacion', option)}
                      className={`px-4 py-3 rounded-full font-semibold transition-all duration-300 text-sm ${
                        data.ocupacion === option
                          ? 'bg-[#2167AE] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={!isComplete}
              className={`w-full mt-8 font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                isComplete
                  ? 'bg-[#2167AE] text-white hover:bg-[#1E2D6B]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Comenzar los niveles
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
