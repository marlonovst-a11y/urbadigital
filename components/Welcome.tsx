'use client';

export default function Welcome() {
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
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />
      <button
        style={{
          position: 'absolute',
          left: '50%',
          top: '78%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '60px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          padding: 0,
        }}
        aria-label="Iniciar"
      />
    </div>
  );
}
