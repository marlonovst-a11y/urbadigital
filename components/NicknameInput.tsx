'use client';

import { useState } from 'react';
import Header from './Header';
import { checkNicknameCooldown } from '@/lib/supabase';
import NicknameCooldownDialog from './NicknameCooldownDialog';

interface NicknameInputProps {
  onContinue: (nickname: string) => void | Promise<void>;
}

export default function NicknameInput({ onContinue }: NicknameInputProps) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCooldownDialog, setShowCooldownDialog] = useState(false);
  const [cooldownData, setCooldownData] = useState<{
    allowedAt: Date;
    remainingMinutes: number;
  } | null>(null);

  const isValid = nickname.trim().length >= 3 && nickname.trim().length <= 20;
  const canContinue = isValid && !isSubmitting;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    setError('');

    if (value.length > 20) {
      setError('Máximo 20 caracteres');
    }
  };

  const handleContinue = async () => {
    if (!isValid) {
      setError('El apodo debe tener entre 3 y 20 caracteres');
      return;
    }
    setIsSubmitting(true);
    try {
      const cooldownCheck = await checkNicknameCooldown(nickname.trim());

     if (cooldownCheck.played) {
        setCooldownData({
          allowedAt: cooldownCheck.nextAvailable || new Date(),
          remainingMinutes: 180
        });
        setShowCooldownDialog(true);
        setIsSubmitting(false);
        return;
      }

      await onContinue(nickname.trim());
    } catch (error) {
      setError('Error al guardar. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#ECEEEF]">
      <Header />

      <main className="pt-24 flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8 text-center">
              <div className="inline-block mb-4">
                <img src="/papa.svg" alt="Roberto" style={{ height: '150px' }} />
              </div>
              <p className="text-gray-600">Hola, soy Roberto, el papá de la familia</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-[#2167AE] p-4 mb-6 rounded">
              <p className="text-gray-700">
                ¿Cuál es tu apodo? Te identificaremos con él durante todo el juego.
              </p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={nickname}
                onChange={handleChange}
                placeholder="Tu apodo aquí..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2167AE] transition-colors"
                maxLength={20}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
                  {error || `${nickname.length}/20 caracteres`}
                </span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`w-full font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                canContinue
                  ? 'bg-[#2167AE] text-white hover:bg-[#1E2D6B]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Verificando...' : 'Continuar'}
            </button>
          </div>
        </div>
      </main>

      {showCooldownDialog && cooldownData && (
        <NicknameCooldownDialog
          open={showCooldownDialog}
          onClose={() => setShowCooldownDialog(false)}
          nickname={nickname.trim()}
          allowedAt={cooldownData.allowedAt}
          remainingMinutes={cooldownData.remainingMinutes}
        />
      )}
    </div>
  );
}
