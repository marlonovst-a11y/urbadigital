'use client';

import { useState } from 'react';
import Header from './Header';
import { useSound } from '@/hooks/useSound';

interface Level5Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any) => void;
}

interface Word {
  id: string;
  word: string;
  clue: string;
  direction: 'horizontal' | 'vertical';
  row: number;
  col: number;
  number: number;
  attempts: number;
  completed: boolean;
  revealed: boolean;
}

const words: Word[] = [
  { id: 'H1', word: 'INUNDACION', clue: 'Desastre por lluvias fuertes o ríos desbordados', direction: 'horizontal', row: 0, col: 0, number: 1, attempts: 0, completed: false, revealed: false },
  { id: 'H2', word: 'TERREMOTO', clue: 'Evento natural con movimientos sísmicos', direction: 'horizontal', row: 4, col: 3, number: 2, attempts: 0, completed: false, revealed: false },
  { id: 'H3', word: 'INCENDIO', clue: 'Fuego descontrolado en bosques o áreas urbanas', direction: 'horizontal', row: 1, col: 0, number: 3, attempts: 0, completed: false, revealed: false },
  { id: 'V1', word: 'CIBERATAQUE', clue: 'Amenaza que afecta sistemas tecnológicos o digitales', direction: 'vertical', row: 0, col: 6, number: 1, attempts: 0, completed: false, revealed: false },
  { id: 'V2', word: 'DESASTRE', clue: 'Situación de riesgo con pérdida de vidas y daños materiales', direction: 'vertical', row: 3, col: 4, number: 2, attempts: 0, completed: false, revealed: false },
  { id: 'V3', word: 'DESLAVE', clue: 'Movimiento de tierra por lluvia o sismos', direction: 'vertical', row: 3, col: 7, number: 3, attempts: 0, completed: false, revealed: false },
];

export default function Level5({ participantId, nickname, onComplete }: Level5Props) {
  const { play } = useSound();
  const [wordStates, setWordStates] = useState<Word[]>(words);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);


  const ROWS = 11;
  const COLS = 12;

  const getGridCells = () => {
    const grid: Array<Array<{
      letter: string;
      wordIds: string[];
      number?: number;
      filled: boolean;
      correct: boolean;
      revealed: boolean;
    }>> = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => ({
        letter: '',
        wordIds: [],
        number: undefined,
        filled: false,
        correct: false,
        revealed: false
      }))
    );

    wordStates.forEach(word => {
      for (let i = 0; i < word.word.length; i++) {
        const row = word.direction === 'horizontal' ? word.row : word.row + i;
        const col = word.direction === 'horizontal' ? word.col + i : word.col;

        if (row < ROWS && col < COLS) {
          grid[row][col].letter = word.word[i];
          grid[row][col].wordIds.push(word.id);
          grid[row][col].filled = true;

          if (i === 0) {
            grid[row][col].number = word.number;
          }

          if (word.completed || word.revealed) {
            grid[row][col].correct = word.completed;
            grid[row][col].revealed = word.revealed;
          }
        }
      }
    });

    return grid;
  };

  const handleVerify = () => {
    if (!selectedWord || !inputValue.trim()) return;

    const normalized = inputValue.trim().toUpperCase().replace(/\s+/g, '');
    const isCorrect = normalized === selectedWord.word;

    const updatedWords = wordStates.map(w => {
      if (w.id === selectedWord.id) {
        const newAttempts = w.attempts + 1;

        if (isCorrect) {
          return { ...w, completed: true, attempts: newAttempts };
        } else if (newAttempts >= 3) {
          return { ...w, revealed: true, attempts: newAttempts };
        } else {
          return { ...w, attempts: newAttempts };
        }
      }
      return w;
    });

    if (isCorrect) play('correct'); else play('wrong');
    setWordStates(updatedWords);
    setInputValue('');

    const updatedWord = updatedWords.find(w => w.id === selectedWord.id);
    if (updatedWord && (updatedWord.completed || updatedWord.revealed)) {
      setSelectedWord(null);
    }

    if (updatedWords.every(w => w.completed || w.revealed)) {
      play('complete');
      setTimeout(() => setShowFeedback(true), 500);
    }
  };

  const calculateScore = () => {
    let total = 0;
    wordStates.forEach(word => {
      if (word.completed) {
        if (word.attempts === 1) total += 4;
        else if (word.attempts === 2) total += 2.5;
      }
    });
    return Math.min(20, total);
  };

  const handleContinue = () => {
    const score = calculateScore();
    const responses = wordStates.map(w => ({
      palabra: w.word,
      pista: w.clue,
      intentos: w.attempts,
      completada: w.completed,
      revelada: w.revealed,
      puntos: w.completed ? (w.attempts === 1 ? 4 : w.attempts === 2 ? 2.5 : 0) : 0
    }));
    onComplete(score, responses);
  };

  const grid = getGridCells();
  const completedCount = wordStates.filter(w => w.completed || w.revealed).length;

  if (showInstructions) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/nivel5_instruccion.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        <Header />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', gap: 16 }}>
          <img src="/personajes_instrucciones.png" style={{ width: 'min(85vw, 400px)', maxWidth: '100%' }} />
          <div style={{ background: 'white', borderRadius: 16, padding: 'clamp(16px, 3vw, 24px) clamp(18px, 3.5vw, 32px)', width: 'min(88vw, 440px)', border: '3px solid #2167AE', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 800, color: '#1E2D6B', fontSize: 'clamp(15px, 4vw, 18px)', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>
              ¡Nivel 5 — Crucigrama de Multiamenazas!
            </p>
            <p style={{ margin: '0 0 16px', color: '#444', fontSize: 'clamp(12px, 3.5vw, 15px)', lineHeight: 1.5 }}>
              Lee las pistas de <strong>Horizontales</strong> y <strong>Verticales</strong>, escribe la palabra correcta y presiona Verificar. Tienes <strong>3 intentos</strong> por palabra — si fallas todos, la respuesta se revelará automáticamente.
            </p>
            <button onClick={() => setShowInstructions(false)} style={{ width: '100%', padding: '12px 0', background: '#1ABC9C', color: 'white', fontWeight: 800, fontSize: 'clamp(14px, 1.5vw, 17px)', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,188,156,0.4)' }}>
              ¡Comenzar! 🧩
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!showFeedback) {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/nivel5_fondo.png.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        <Header />

        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>

          {/* Personaje arriba izquierda — Don Manuel */}
          <img src="/manuel_nivel5.png" style={{ position: 'absolute', left: -90, top: -20, width: 'clamp(70px, 8vw, 110px)', zIndex: 11, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />

          {/* Personaje arriba derecha — Sofía */}
          <img src="/sofia_nivel5.png" style={{ position: 'absolute', right: -90, top: -20, width: 'clamp(70px, 8vw, 110px)', zIndex: 11, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />

          {/* Personaje abajo izquierda — Roberto */}
          <img src="/roberto_nivel5.png" style={{ position: 'absolute', left: -90, bottom: -20, width: 'clamp(70px, 8vw, 110px)', zIndex: 11, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />

          {/* Personaje abajo derecha — Carmen */}
          <img src="/carmen_nivel5.png" style={{ position: 'absolute', right: -90, bottom: -20, width: 'clamp(70px, 8vw, 110px)', zIndex: 11, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />

          {/* Crucigrama */}
          <div style={{ background: 'rgba(66,115,174,0.40)', padding: 12, borderRadius: 12, backdropFilter: 'blur(4px)' }}>
            <div style={{ display: 'grid', gap: 3, gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
              {grid.map((row, i) =>
                row.map((cell, j) => {
                  if (!cell.filled) return <div key={`${i}-${j}`} style={{ width: 'clamp(22px, 2.5vw, 36px)', height: 'clamp(22px, 2.5vw, 36px)', background: 'transparent' }} />;
                  const isSelected = selectedWord && cell.wordIds.includes(selectedWord.id);
                  return (
                    <div key={`${i}-${j}`}
                      onClick={() => {
                        const word = wordStates.find(w => cell.wordIds.includes(w.id) && !w.completed && !w.revealed);
                        if (word) { setSelectedWord(word); setInputValue(''); }
                      }}
                      style={{ width: 'clamp(22px, 2.5vw, 36px)', height: 'clamp(22px, 2.5vw, 36px)', background: cell.correct ? '#D4F5E0' : cell.revealed ? '#DCE9F8' : isSelected ? '#FFF9E6' : 'white', border: `2px solid ${cell.correct ? '#1ABC9C' : cell.revealed ? '#2167AE' : isSelected ? '#F39C12' : '#2167AE'}`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
                      {cell.number && <span style={{ position: 'absolute', top: 1, left: 2, fontSize: 'clamp(5px, 0.6vw, 8px)', fontWeight: 800, color: '#2167AE' }}>{cell.number}</span>}
                      {(cell.correct || cell.revealed) && <span style={{ fontSize: 'clamp(10px, 1.2vw, 16px)', fontWeight: 800, color: '#1E2D6B', fontFamily: 'Zurich_Light_Condensed_BT, sans-serif' }}>{cell.letter}</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: '8%', right: '2%', zIndex: 10, background: 'rgba(33,103,174,0.85)', borderRadius: 12, padding: '6px 14px', color: 'white', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(4px)' }}>
          {completedCount} / 6 palabras
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>

          {selectedWord && !selectedWord.completed && !selectedWord.revealed && (
            <div style={{ background: 'rgba(33,103,174,0.92)', backdropFilter: 'blur(8px)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              <p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: 'clamp(12px, 1.4vw, 16px)', maxWidth: 400, textAlign: 'center' }}>
                {selectedWord.clue}
              </p>
              <input
                type="text" value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="Escribe tu respuesta"
                style={{ padding: '8px 16px', borderRadius: 50, border: '2px solid white', fontSize: 14, fontWeight: 600, textTransform: 'uppercase', width: 200, outline: 'none' }}
                autoFocus
              />
              <button onClick={handleVerify} style={{ padding: '8px 20px', background: '#1ABC9C', color: 'white', fontWeight: 800, borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                Verificar ✓
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(10,20,40,0.88)', backdropFilter: 'blur(8px)', maxHeight: 200, overflow: 'hidden' }}>

            {/* Horizontales */}
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.2)', padding: '8px 12px', overflowY: 'auto' }}>
              <p style={{ margin: '0 0 6px', color: '#F9D030', fontWeight: 800, fontSize: 13 }}>📖 Horizontales</p>
              {wordStates.filter(w => w.direction === 'horizontal').map(word => (
                <div key={word.id} onClick={() => { if (!word.completed && !word.revealed) { setSelectedWord(word); setInputValue(''); } }}
                  style={{ padding: '5px 8px', marginBottom: 4, borderRadius: 8, cursor: 'pointer', background: word.completed || word.revealed ? 'rgba(26,188,156,0.3)' : selectedWord?.id === word.id ? 'rgba(249,208,48,0.3)' : 'rgba(255,255,255,0.08)', border: `1px solid ${word.completed || word.revealed ? '#1ABC9C' : selectedWord?.id === word.id ? '#F9D030' : 'rgba(255,255,255,0.2)'}` }}>
                  <p style={{ margin: 0, color: 'white', fontSize: 12 }}>
                    <span style={{ fontWeight: 800, color: '#F9D030' }}>{word.number}. </span>{word.clue}
                    {word.attempts > 0 && !word.completed && !word.revealed && <span style={{ color: '#E74C3C', fontSize: 10, marginLeft: 6 }}>({word.attempts}/3)</span>}
                  </p>
                </div>
              ))}
            </div>
            {/* Verticales */}
            <div style={{ padding: '8px 12px', overflowY: 'auto' }}>
              <p style={{ margin: '0 0 6px', color: '#F9D030', fontWeight: 800, fontSize: 13 }}>📖 Verticales</p>
              {wordStates.filter(w => w.direction === 'vertical').map(word => (
                <div key={word.id} onClick={() => { if (!word.completed && !word.revealed) { setSelectedWord(word); setInputValue(''); } }}
                  style={{ padding: '5px 8px', marginBottom: 4, borderRadius: 8, cursor: 'pointer', background: word.completed || word.revealed ? 'rgba(26,188,156,0.3)' : selectedWord?.id === word.id ? 'rgba(249,208,48,0.3)' : 'rgba(255,255,255,0.08)', border: `1px solid ${word.completed || word.revealed ? '#1ABC9C' : selectedWord?.id === word.id ? '#F9D030' : 'rgba(255,255,255,0.2)'}` }}>
                  <p style={{ margin: 0, color: 'white', fontSize: 12 }}>
                    <span style={{ fontWeight: 800, color: '#F9D030' }}>{word.number}. </span>{word.clue}
                    {word.attempts > 0 && !word.completed && !word.revealed && <span style={{ color: '#E74C3C', fontSize: 10, marginLeft: 6 }}>({word.attempts}/3)</span>}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundImage: 'url(/nivel5_fondo.png.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
      <Header />
      <div className="flex items-center justify-center" style={{ height: '100%', paddingTop: 56, paddingBottom: 24 }}>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-8 overflow-y-auto" style={{ maxWidth: 700, width: '92%', maxHeight: 'calc(100vh - 80px)' }}>
          <div className="bg-[#2167AE] text-white rounded-lg p-4 md:p-6 mb-4 md:mb-6">
            <h3 className="font-bold text-base md:text-xl mb-2 md:mb-3">
              ¡Crucigrama completado!
            </h3>
            <p className="text-sm md:text-lg mb-1 md:mb-2">
              Puntaje obtenido: <span className="font-bold">{calculateScore()} puntos</span>
            </p>
            <p className="text-xs md:text-sm leading-relaxed">
              Conocer las diferentes amenazas te ayuda a prepararte mejor. Inundaciones, terremotos, incendios, ciberataques, deslaves y otros desastres requieren acciones específicas de prevención y respuesta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            {wordStates.map(word => (
              <div key={word.id} className="bg-[#ECEEEF] rounded-lg p-3 md:p-4">
                <p className="font-bold text-[#1E2D6B] text-base md:text-lg mb-1">
                  {word.word}
                </p>
                <p className="text-xs md:text-sm text-gray-700 mb-2">{word.clue}</p>
                <div className="flex items-center gap-2">
                  {word.completed ? (
                    <>
                      <span className="text-xs bg-[#1ABC9C] text-white px-2 py-1 rounded">
                        Correcto en {word.attempts} {word.attempts === 1 ? 'intento' : 'intentos'}
                      </span>
                      <span className="text-xs text-[#1ABC9C] font-bold">
                        +{word.attempts === 1 ? 4 : word.attempts === 2 ? 2.5 : 0} pts
                      </span>
                    </>
                  ) : (
                    <span className="text-xs bg-[#4A90D9] text-white px-2 py-1 rounded">
                      Revelada después de 3 intentos
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3 bg-[#1ABC9C] text-white font-bold rounded-lg hover:bg-[#27AE60] transition-colors text-sm md:text-lg min-h-[44px]"
          >
            Continuar al Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
