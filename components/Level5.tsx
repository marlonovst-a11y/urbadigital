'use client';

import { useState } from 'react';
import Header from './Header';

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
  { id: 'V3', word: 'DESLAVE', clue: 'Movimiento de tierra por lluvia o sismos', direction: 'vertical', row: 3, col: 7, number: 3, attempts: 0, completed: false, revealed: false }
];

export default function Level5({ participantId, nickname, onComplete }: Level5Props) {
  const [wordStates, setWordStates] = useState<Word[]>(words);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

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

    setWordStates(updatedWords);
    setInputValue('');

    const updatedWord = updatedWords.find(w => w.id === selectedWord.id);
    if (updatedWord && (updatedWord.completed || updatedWord.revealed)) {
      setSelectedWord(null);
    }

    if (updatedWords.every(w => w.completed || w.revealed)) {
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: 'url(/nivel5.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <Header />

      <main className="pt-24 flex-1 px-4 pb-8 relative z-10 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto w-full">

          <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <img src="/personajes.svg" alt="Familia" style={{ height: '72px' }} />
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-md">
                  Nivel 5: Crucigrama de Multiamenazas
                </h1>
                <p className="text-white/90 text-sm mt-1">
                  Completa el crucigrama identificando diferentes amenazas
                </p>
              </div>
            </div>
            <div className="bg-[#2167AE] text-white rounded-lg px-4 py-2 shadow">
              <p className="font-semibold text-sm">Progreso: {completedCount} / 6 palabras</p>
            </div>
          </div>

          {!showFeedback && (
            <div className="flex gap-5 items-start">
              <div className="bg-white/90 rounded-xl shadow-lg p-5" style={{ flex: '0 0 60%' }}>
                <div className="inline-block bg-[#1E2D6B] p-4 rounded-lg">
                  <div className="grid gap-1" style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`
                  }}>
                    {grid.map((row, i) =>
                      row.map((cell, j) => {
                        if (!cell.filled) {
                          return (
                            <div
                              key={`${i}-${j}`}
                              className="w-8 h-8 bg-[#1E2D6B] opacity-13"
                            />
                          );
                        }

                        const isSelected = selectedWord && cell.wordIds.includes(selectedWord.id);
                        let bgClass = 'bg-white';
                        let borderClass = 'border-[#2167AE]';

                        if (cell.correct) {
                          bgClass = 'bg-[#D4F5E0]';
                          borderClass = 'border-[#1ABC9C]';
                        } else if (cell.revealed) {
                          bgClass = 'bg-[#DCE9F8]';
                          borderClass = 'border-[#2167AE]';
                        } else if (isSelected) {
                          bgClass = 'bg-[#FFF9E6]';
                        }

                        return (
                          <div
                            key={`${i}-${j}`}
                            className={`w-8 h-8 ${bgClass} border-2 ${borderClass} rounded-sm flex items-center justify-center relative cursor-pointer transition-colors`}
                            onClick={() => {
                              const word = wordStates.find(w =>
                                cell.wordIds.includes(w.id) && !w.completed && !w.revealed
                              );
                              if (word) {
                                setSelectedWord(word);
                                setInputValue('');
                              }
                            }}
                          >
                            {cell.number && (
                              <span className="absolute top-0 left-0.5 text-[7px] font-bold text-[#2167AE]">
                                {cell.number}
                              </span>
                            )}
                            {(cell.correct || cell.revealed) && (
                              <span className="text-xs font-bold text-[#1E2D6B]">
                                {cell.letter}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4" style={{ flex: '0 0 40%' }}>
                <div className="bg-white/90 rounded-xl shadow-lg p-4">
                  <h3 className="font-bold text-[#1E2D6B] mb-3">Horizontales</h3>
                  <div className="space-y-2">
                    {wordStates.filter(w => w.direction === 'horizontal').map(word => (
                      <div
                        key={word.id}
                        onClick={() => {
                          if (!word.completed && !word.revealed) {
                            setSelectedWord(word);
                            setInputValue('');
                          }
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          word.completed || word.revealed
                            ? 'bg-[#EDFBF3] border-2 border-[#1ABC9C]'
                            : selectedWord?.id === word.id
                              ? 'bg-[#FFF9E6] border-2 border-[#F39C12]'
                              : 'bg-white border-2 border-gray-200 hover:border-[#2167AE]'
                        }`}
                      >
                        <p className="text-sm">
                          <span className="font-bold text-[#2167AE]">{word.number}.</span> {word.clue}
                        </p>
                        {word.attempts > 0 && !word.completed && !word.revealed && (
                          <p className="text-xs text-[#E74C3C] mt-1">
                            Intentos: {word.attempts}/3
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/90 rounded-xl shadow-lg p-4">
                  <h3 className="font-bold text-[#1E2D6B] mb-3">Verticales</h3>
                  <div className="space-y-2">
                    {wordStates.filter(w => w.direction === 'vertical').map(word => (
                      <div
                        key={word.id}
                        onClick={() => {
                          if (!word.completed && !word.revealed) {
                            setSelectedWord(word);
                            setInputValue('');
                          }
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          word.completed || word.revealed
                            ? 'bg-[#EDFBF3] border-2 border-[#1ABC9C]'
                            : selectedWord?.id === word.id
                              ? 'bg-[#FFF9E6] border-2 border-[#F39C12]'
                              : 'bg-white border-2 border-gray-200 hover:border-[#2167AE]'
                        }`}
                      >
                        <p className="text-sm">
                          <span className="font-bold text-[#2167AE]">{word.number}.</span> {word.clue}
                        </p>
                        {word.attempts > 0 && !word.completed && !word.revealed && (
                          <p className="text-xs text-[#E74C3C] mt-1">
                            Intentos: {word.attempts}/3
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedWord && !selectedWord.completed && !selectedWord.revealed && (
                  <div className="bg-[#2167AE] rounded-xl shadow-lg p-4">
                    <p className="text-white font-semibold mb-3">
                      {selectedWord.clue}
                    </p>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                      placeholder="Escribe tu respuesta"
                      className="w-full px-3 py-2 rounded border-2 border-white mb-3 uppercase"
                      autoFocus
                    />
                    <button
                      onClick={handleVerify}
                      className="w-full py-2 bg-[#1ABC9C] text-white font-bold rounded-lg hover:bg-[#27AE60] transition-colors"
                    >
                      Verificar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {showFeedback && (
            <div className="bg-white/90 rounded-xl shadow-lg p-8">
              <div className="bg-[#2167AE] text-white rounded-lg p-6 mb-6">
                <h3 className="font-bold text-xl mb-3">
                  ¡Crucigrama completado!
                </h3>
                <p className="text-lg mb-2">
                  Puntaje obtenido: <span className="font-bold">{calculateScore()} puntos</span>
                </p>
                <p className="text-sm leading-relaxed">
                  Conocer las diferentes amenazas te ayuda a prepararte mejor. Inundaciones, terremotos, incendios, ciberataques, deslaves y otros desastres requieren acciones específicas de prevención y respuesta.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {wordStates.map(word => (
                  <div
                    key={word.id}
                    className="bg-[#ECEEEF] rounded-lg p-4"
                  >
                    <p className="font-bold text-[#1E2D6B] text-lg mb-1">
                      {word.word}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">{word.clue}</p>
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
                className="w-full py-3 bg-[#1ABC9C] text-white font-bold rounded-lg hover:bg-[#27AE60] transition-colors text-lg"
              >
                Continuar al Mapa
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
