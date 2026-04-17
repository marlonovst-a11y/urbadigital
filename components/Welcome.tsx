'use client';

export default function Welcome() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/fondo_inicio.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Rostros de personajes */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(8px, 2vw, 24px)', marginBottom: 24 }}>
        {['/manuel1.png', '/roberto1.png', '/carmen1.png', '/sofia1.png'].map((src, i) => (
          <img key={i} src={src} alt="" style={{ width: 'clamp(70px, 9vw, 130px)', height: 'clamp(70px, 9vw, 130px)', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))', transition: 'transform 0.2s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
        ))}
      </div>

      {/* Bocadillo con texto */}
      <div style={{ background: 'rgba(33,103,174,0.85)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: 'clamp(20px, 3vw, 36px) clamp(28px, 5vw, 60px)', marginBottom: 32, maxWidth: 'clamp(320px, 65vw, 780px)', textAlign: 'center', border: '3px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <p style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(20px, 3vw, 42px)', margin: '0 0 8px', lineHeight: 1.3, fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>
          Aprende a <strong>prevenir</strong>
        </p>
        <p style={{ color: 'white', fontWeight: 400, fontSize: 'clamp(20px, 3vw, 42px)', margin: '0 0 8px', lineHeight: 1.3, fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>
          y <strong>proteger</strong> a tu familia
        </p>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(13px, 1.5vw, 18px)', margin: 0, lineHeight: 1.5 }}>
          Completa 5 niveles sobre prevención de riesgos.<br />
          Cada nivel vale 20 puntos. El formulario final te da 10 puntos extra.
        </p>
      </div>

      {/* Botón INICIAR */}
      <button style={{ background: '#F9D030', color: '#1E2D6B', fontWeight: 900, fontSize: 'clamp(20px, 3vw, 36px)', fontFamily: 'RobotRadicals, sans-serif', padding: 'clamp(12px, 1.5vw, 18px) clamp(40px, 6vw, 80px)', borderRadius: 16, border: '4px solid #1E2D6B', cursor: 'pointer', boxShadow: '0 6px 24px rgba(0,0,0,0.3)', letterSpacing: '0.05em', transition: 'transform 0.15s, box-shadow 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.3)'; }}
      >
        INICIAR
      </button>

    </div>
  );
}
