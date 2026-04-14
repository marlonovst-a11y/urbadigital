'use client';

import { SessionData, getExpiryDateTime, clearSession } from '@/lib/session';
import Header from './Header';

interface SessionStatusProps {
  type: 'active_incomplete' | 'active_completed';
  session: SessionData;
  onContinue?: () => void;
  onStartNew: () => void;
}

export default function SessionStatus({ type, session, onContinue, onStartNew }: SessionStatusProps) {
  const { date, time } = getExpiryDateTime(session);

  const handleStartNew = () => {
    clearSession();
    onStartNew();
  };

  if (type === 'active_incomplete') {
    return (
      <div className="min-h-screen flex flex-col bg-[#ECEEEF]">
        <Header />

        <main className="pt-24 flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6 text-center">
                <div className="inline-block mb-4">
                  <img src="/papa.svg" alt="Roberto" style={{ height: '120px' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Hola de nuevo, {session.nickname}!
                </h2>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#2167AE] p-4 mb-6 rounded">
                <p className="text-gray-700 font-semibold mb-2">
                  Tienes una sesión en curso
                </p>
                <p className="text-gray-600 text-sm">
                  Puedes continuar donde te quedaste o empezar de nuevo.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onContinue}
                  className="w-full bg-[#2167AE] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#1E2D6B] transition-colors duration-300"
                >
                  Continuar donde me quedé
                </button>

                <button
                  onClick={handleStartNew}
                  className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                >
                  Empezar de nuevo
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#ECEEEF]">
      <Header />

      <main className="pt-24 flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6 text-center">
              <div className="inline-block mb-4">
                <img src="/personajes.svg" alt="Familia completa" style={{ height: '120px' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ya participaste hoy!
              </h2>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
              <p className="text-gray-700 font-semibold mb-3">
                Tu puntaje obtenido: {session.finalScore} puntos
              </p>
              <p className="text-gray-600 text-sm">
                Gracias por completar el juego. Para volver a jugar, deberás esperar 24 horas desde tu última participación.
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-[#2167AE] p-4 rounded">
              <p className="text-gray-700 font-semibold mb-2">
                Podrás jugar de nuevo:
              </p>
              <p className="text-gray-800 font-bold">
                {date}
              </p>
              <p className="text-gray-800 font-bold">
                a las {time}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
