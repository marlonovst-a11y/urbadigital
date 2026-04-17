'use client';

interface SessionRecoveryDialogProps {
  open: boolean;
  nickname: string;
  onContinue: () => void;
  onStartNew: () => void;
}

export default function SessionRecoveryDialog({ open, nickname, onContinue, onStartNew }: SessionRecoveryDialogProps) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(24px,4vw,40px)', maxWidth: 460, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', textAlign: 'center' }}>

        <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>

        <h2 style={{ color: '#1E2D6B', fontWeight: 800, fontSize: 'clamp(18px,2.5vw,24px)', marginBottom: 8 }}>
          ¡Bienvenido de nuevo, {nickname}!
        </h2>

        <p style={{ color: '#555', fontSize: 'clamp(13px,1.5vw,16px)', lineHeight: 1.5, marginBottom: 28 }}>
          Encontramos una sesión anterior. ¿Quieres continuar donde lo dejaste o empezar de nuevo?
        </p>

        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <button onClick={onContinue} style={{ width: '100%', padding: '14px 0', background: '#2167AE', color: 'white', fontWeight: 800, fontSize: 'clamp(14px,1.8vw,18px)', borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(33,103,174,0.4)' }}>
            Continuar sesión →
          </button>
          <button onClick={onStartNew} style={{ width: '100%', padding: '14px 0', background: 'rgba(255,255,255,0)', color: '#888', fontWeight: 600, fontSize: 'clamp(13px,1.5vw,16px)', borderRadius: 12, border: '2px solid #ddd', cursor: 'pointer' }}>
            Empezar de nuevo
          </button>
        </div>

      </div>
    </div>
  );
}
