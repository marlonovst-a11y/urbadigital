'use client';

import { useState } from 'react';
import { checkNicknameCooldown } from '@/lib/supabase';
import { useSound } from '@/hooks/useSound';
import NicknameCooldownDialog from './NicknameCooldownDialog';

interface NicknameInputProps {
  onContinue: (nickname: string) => void | Promise<void>;
}

export default function NicknameInput({ onContinue }: NicknameInputProps) {
  const { play } = useSound();
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
    <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/fondo_nickname.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '90%', maxWidth: 600 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src="/roberto_retos.png" style={{ width: 'clamp(80px, 10vw, 140px)', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }} />
          <div style={{ background: 'white', borderRadius: 16, padding: '16px 24px', border: '3px solid #2167AE', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'relative', maxWidth: 380 }}>
            <div style={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderRight: '14px solid #2167AE' }} />
            <div style={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderRight: '12px solid white' }} />
            <p style={{ margin: 0, color: '#1E2D6B', fontWeight: 700, fontSize: 'clamp(14px, 1.6vw, 20px)', lineHeight: 1.4, fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>
              ¡Bienvenido a la familia!<br />
              Antes de empezar, ¿cómo te llamas?
            </p>
          </div>
        </div>

        <input
          type="text"
          value={nickname}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Tu apodo aquí..."
          maxLength={20}
          style={{ width: '100%', maxWidth: 400, padding: '14px 20px', borderRadius: 50, border: '3px solid rgba(33,103,174,0.5)', background: 'rgba(255,255,255,0.90)', fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 600, color: '#1E2D6B', outline: 'none', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}
        />

        {error && (
          <span style={{ color: '#c0392b', fontSize: 13, fontWeight: 600, background: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: '4px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {error}
          </span>
        )}

        <button
          onClick={() => { play('click'); handleContinue(); }}
          disabled={!canContinue}
          style={{ padding: 'clamp(10px,1.5vw,16px) clamp(40px,6vw,80px)', borderRadius: 16, border: '4px solid #1E2D6B', background: canContinue ? '#F9D030' : 'rgba(200,200,200,0.7)', color: canContinue ? '#1E2D6B' : '#888', fontWeight: 900, fontSize: 'clamp(18px, 2.5vw, 28px)', fontFamily: 'RobotRadicals, sans-serif', cursor: canContinue ? 'pointer' : 'not-allowed', letterSpacing: '0.05em', boxShadow: canContinue ? '0 6px 20px rgba(0,0,0,0.25)' : 'none', transition: 'all 0.2s', textTransform: 'uppercase' }}
        >
          {isSubmitting ? 'Verificando...' : 'CONTINUAR'}
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
