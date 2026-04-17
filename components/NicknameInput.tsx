'use client';

import { useState } from 'react';
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
        setError('Este nombre ya fue usado recientemente. Por favor espera 3 horas o usa un nombre diferente.');
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canContinue) {
      handleContinue();
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/nickname.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '55%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          width: '400px',
        }}
      >
        <input
          type="text"
          value={nickname}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Tu apodo aquí..."
          maxLength={20}
          style={{
            width: '400px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '2px solid rgba(33, 103, 174, 0.4)',
            background: 'rgba(255, 255, 255, 0.85)',
            fontSize: '18px',
            fontWeight: 500,
            color: '#1a2a3a',
            outline: 'none',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        />
        {error && (
          <span
            style={{
              color: '#c0392b',
              fontSize: '13px',
              fontWeight: 600,
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '6px',
              padding: '2px 10px',
            }}
          >
            {error}
          </span>
        )}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          style={{
            width: '200px',
            height: '60px',
            borderRadius: '16px',
            border: 'none',
            background: canContinue ? '#f5c518' : 'rgba(200,200,200,0.7)',
            color: canContinue ? '#1a2a00' : '#888',
            fontWeight: 800,
            fontSize: '18px',
            letterSpacing: '0.08em',
            cursor: canContinue ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            transition: 'background 0.2s, color 0.2s',
            textTransform: 'uppercase',
          }}
        >
          {isSubmitting ? 'Verificando...' : 'Continuar'}
        </button>
      </div>

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
