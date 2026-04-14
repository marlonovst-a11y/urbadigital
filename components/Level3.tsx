'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './Header';

interface Level3Props {
  participantId: string;
  nickname: string;
  onComplete: (score: number, responses: any) => void;
}

interface Action {
  id: number;
  accion: string;
  categoria: 'ANTES' | 'DURANTE' | 'DESPUÉS';
}

const actions: Action[] = [
  { id: 1, accion: 'Preparar mochila de emergencia', categoria: 'ANTES' },
  { id: 2, accion: 'Llamar a los servicios de emergencia', categoria: 'DURANTE' },
  { id: 3, accion: 'Limpiar y desinfectar la vivienda', categoria: 'DESPUÉS' },
  { id: 4, accion: 'Identificar rutas de evacuación', categoria: 'ANTES' },
  { id: 5, accion: 'Alejarse de zonas inundadas', categoria: 'DURANTE' },
  { id: 6, accion: 'Revisar daños estructurales', categoria: 'DESPUÉS' },
  { id: 7, accion: 'Almacenar agua potable', categoria: 'ANTES' },
  { id: 8, accion: 'No caminar en aguas de inundación', categoria: 'DURANTE' },
  { id: 9, accion: 'Reportar daños a las autoridades', categoria: 'DESPUÉS' },
];

type AnswerState = 'idle' | 'correct' | 'wrong';

interface Response {
  accion: string;
  respuesta_dada: 'ANTES' | 'DURANTE' | 'DESPUÉS';
  correcta: boolean;
  puntos: number;
}

export default function Level3({ participantId, nickname, onComplete }: Level3Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [selectedCategory, setSelectedCategory] = useState<'ANTES' | 'DURANTE' | 'DESPUÉS' | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const answeredRef = useRef(false);
  const answerStateRef = useRef<AnswerState>('idle');

  useEffect(() => {
    fetch('/nivel3.svg')
      .then(r => r.text())
      .then(text => setSvgContent(text));
  }, []);

  const currentAction = actions[currentIndex];

  const injectSvgStyles = useCallback((svgEl: Element) => {
    const styleId = 'level3-dynamic-styles';
    if (svgEl.querySelector(`#${styleId}`)) return;
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.id = styleId;
    style.textContent = `
      [id^="btn-antes"], [id^="btn-durante"], [id^="btn-despues"] {
        cursor: pointer;
        transition: transform 0.1s ease;
      }
      [id^="btn-antes"]:active, [id^="btn-durante"]:active, [id^="btn-despues"]:active {
        transform: scale(0.94);
      }
      [id^="nav-"] {
        cursor: default;
        pointer-events: none;
      }
    `;
    svgEl.insertBefore(style, svgEl.firstChild);
  }, []);

  const positionElementsAfterPaint = useCallback(() => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const svgRect = svgEl.getBoundingClientRect();
    if (svgRect.width === 0) return;

    const svgViewBox = svgEl.viewBox?.baseVal;
    const scaleX = svgViewBox ? svgViewBox.width / svgRect.width : 1;
    const scaleY = svgViewBox ? svgViewBox.height / svgRect.height : 1;

    const bocadilloGroup = svgEl.querySelector('#bocadillo-2, [data-name="bocadillo"]') as SVGElement | null;
    const textEl = svgEl.querySelector('#bocadillo text') as SVGTextElement | null;
    if (bocadilloGroup && textEl) {
      const paths = bocadilloGroup.querySelectorAll('path');
      if (paths.length >= 2) {
        const bubblePath = paths[1] as SVGElement;
        const bubbleRect = bubblePath.getBoundingClientRect();
        if (bubbleRect.width > 0 && bubbleRect.height > 0) {
          const cx = (bubbleRect.left - svgRect.left + bubbleRect.width / 2) * scaleX;
          const cy = (bubbleRect.top - svgRect.top + bubbleRect.height / 2) * scaleY;

          textEl.removeAttribute('transform');
          textEl.setAttribute('x', String(cx));
          textEl.setAttribute('y', String(cy));
          textEl.setAttribute('text-anchor', 'middle');
          textEl.setAttribute('dominant-baseline', 'middle');

          while (textEl.firstChild) textEl.removeChild(textEl.firstChild);
          const text = currentAction?.accion || '';
          const words = text.split(' ');
          const maxCharsPerLine = 22;
          const lines: string[] = [];
          let current = '';
          for (const word of words) {
            if ((current + ' ' + word).trim().length > maxCharsPerLine && current) {
              lines.push(current.trim());
              current = word;
            } else {
              current = (current + ' ' + word).trim();
            }
          }
          if (current) lines.push(current.trim());

          const lineHeightVU = 44 * scaleY;
          const totalH = lines.length * lineHeightVU;
          const startY = cy - totalH / 2 + lineHeightVU / 2;

          if (lines.length === 1) {
            textEl.textContent = text;
          } else {
            lines.forEach((line, li) => {
              const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
              tspan.setAttribute('x', String(cx));
              tspan.setAttribute('y', String(startY + li * lineHeightVU));
              tspan.textContent = line;
              textEl.appendChild(tspan);
            });
          }
        }
      }
    }

    const allSvgTexts = svgEl.querySelectorAll('text') as NodeListOf<SVGTextElement>;
    allSvgTexts.forEach(t => {
      const content = t.textContent?.trim();
      if (content === 'nav-1') t.textContent = '1';
      else if (content === 'nav-2') t.textContent = '2';
      else if (content === 'nav-3') t.textContent = '3';
      else if (content === 'nav-4') t.textContent = '4';
      else if (content === 'nav-5') t.textContent = '5';
      else if (content === 'nav-6') t.textContent = '6';
      else if (content === 'nav-7') t.textContent = '7';
      else if (content === 'nav-8') t.textContent = '8';
      else if (content === 'nav-9') t.textContent = '9';
    });
    allSvgTexts.forEach(t => {
      const content = t.textContent?.trim();
      if (['1','2','3','4','5','6','7','8','9'].includes(content || '')) {
        const currentX = parseFloat(t.getAttribute('x') || '0');
        t.setAttribute('x', String(currentX + 15));
        t.setAttribute('text-anchor', 'middle');
      }
    });
  }, [currentAction, currentIndex]);

  const updateSvg = useCallback(() => {
    if (!containerRef.current || !svgContent) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    injectSvgStyles(svgEl);

    const bocadilloTextEl = svgEl.querySelector('#bocadillo text') as SVGTextElement | null;
    if (bocadilloTextEl) {
      bocadilloTextEl.style.fontFamily = 'ZurichCondensed, sans-serif';
      bocadilloTextEl.style.fontSize = '52px';
      bocadilloTextEl.style.fontWeight = 'bold';
      bocadilloTextEl.style.fill = '#222';
    }

    const navIds = ['nav-1', 'nav-2', 'nav-3', 'nav-4', 'nav-5', 'nav-6', 'nav-7', 'nav-8', 'nav-9'];
    navIds.forEach((navId, i) => {
      const navGroups = svgEl.querySelectorAll(`[id="${navId}"]`) as NodeListOf<SVGElement>;
      if (!navGroups.length) return;

      navGroups.forEach(navGroup => {
        navGroup.style.transform = '';

        const paths = navGroup.querySelectorAll('path');
        const textNode = navGroup.querySelector(':scope > text') as SVGTextElement | null;

        if (i < currentIndex) {
          paths.forEach(p => {
            const fill = p.getAttribute('fill');
            if (fill && fill !== 'none') {
              p.setAttribute('fill', '#2ECC71');
              p.removeAttribute('stroke');
            }
          });
          if (textNode) {
            textNode.style.fill = '#ffffff';
            textNode.style.textShadow = '';
          }
        } else if (i === currentIndex) {
          paths.forEach((p, pi) => {
            const fill = p.getAttribute('fill');
            if (fill && fill !== 'none') {
              p.setAttribute('fill', '#F9D030');
              if (pi === 0) {
                p.setAttribute('stroke', '#ffffff');
                p.setAttribute('stroke-width', '8');
              }
            }
          });
          if (textNode) {
            textNode.style.fill = '#FFE000';
            textNode.setAttribute('filter', 'drop-shadow(0 0 4px #000)');
          }
        } else {
          paths.forEach(p => {
            p.removeAttribute('stroke');
            const cls = p.getAttribute('class');
            if (cls === 'cls-74') p.setAttribute('fill', '#9B8B3A');
            else if (cls === 'cls-75') p.setAttribute('fill', '#7a6e2e');
            else if (cls === 'cls-76') p.setAttribute('fill', '#5c5222');
            else if (cls === 'cls-77') p.setAttribute('fill', '#4a4219');
            else if (cls === 'cls-48') p.setAttribute('fill', '#fff');
            else {
              const fill = p.getAttribute('fill');
              if (fill && fill !== 'none') p.setAttribute('fill', '#9B8B3A');
            }
          });
          if (textNode) {
            textNode.style.fill = '#ffffff';
            textNode.removeAttribute('filter');
          }
        }
      });
    });

    const setButtonColor = (btnId: string, color: string) => {
      const group = svgEl.querySelector(`#${btnId}`) as SVGElement | null;
      if (!group) return;
      group.style.transform = '';
      group.querySelectorAll('rect, path').forEach(el => {
        const fill = (el as SVGElement).getAttribute('fill');
        if (fill && fill !== 'none' && !fill.startsWith('url')) {
          (el as SVGElement).setAttribute('fill', color);
        }
      });
    };

    setButtonColor('btn-antes', '#ffe03c');
    setButtonColor('btn-durante', '#ffe03c');
    setButtonColor('btn-despues', '#ffe03c');

    if (answerState !== 'idle' && selectedCategory) {
      const correct = currentAction?.categoria;
      const btnMap: Record<string, string> = {
        'ANTES': 'btn-antes',
        'DURANTE': 'btn-durante',
        'DESPUÉS': 'btn-despues',
      };

      const selectedBtnId = btnMap[selectedCategory];
      const correctBtnId = btnMap[correct];

      if (answerState === 'correct') {
        setButtonColor(selectedBtnId, '#2ECC71');
      } else {
        setButtonColor(selectedBtnId, '#E74C3C');
        setButtonColor(correctBtnId, '#2ECC71');
      }
    }
  }, [svgContent, currentIndex, currentAction, answerState, selectedCategory, injectSvgStyles]);

  useEffect(() => {
    updateSvg();
    if (containerRef.current) {
      const svgEl = containerRef.current.querySelector('svg');
      if (svgEl) {
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
        svgEl.style.maxHeight = '100%';
        svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      }
    }
    requestAnimationFrame(() => {
      positionElementsAfterPaint();
    });
  }, [updateSvg, positionElementsAfterPaint]);

  useEffect(() => {
    const handleResize = () => positionElementsAfterPaint();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [positionElementsAfterPaint]);

  const handleAnswer = useCallback((category: 'ANTES' | 'DURANTE' | 'DESPUÉS') => {
    if (answeredRef.current || answerStateRef.current !== 'idle') return;
    answeredRef.current = true;
    answerStateRef.current = 'correct';

    const isCorrect = currentAction.categoria === category;
    const points = isCorrect ? 2.2 : 0;

    setSelectedCategory(category);
    setAnswerState(isCorrect ? 'correct' : 'wrong');

    const newResponse: Response = {
      accion: currentAction.accion,
      respuesta_dada: category,
      correcta: isCorrect,
      puntos: points,
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    setTimeout(() => {
      if (currentIndex < actions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setAnswerState('idle');
        setSelectedCategory(null);
        answeredRef.current = false;
        answerStateRef.current = 'idle';
      } else {
        const score = Math.round(Math.min(20, updatedResponses.reduce((sum, r) => sum + r.puntos, 0)));
        setTotalScore(score);
        setShowFinalFeedback(true);
      }
    }, 1500);
  }, [answerState, currentAction, currentIndex, responses]);

  useEffect(() => {
    if (!containerRef.current) return;
    const wire = (id: string, category: 'ANTES' | 'DURANTE' | 'DESPUÉS') => {
      const el = containerRef.current!.querySelector(`#${id}`) as SVGElement | null;
      if (!el || !el.parentNode) return;
      const newEl = el.cloneNode(true) as SVGElement;
      el.parentNode.replaceChild(newEl, el);
      newEl.onclick = () => handleAnswer(category);
    };
    wire('btn-antes', 'ANTES');
    wire('btn-durante', 'DURANTE');
    wire('btn-despues', 'DESPUÉS');
  }, [handleAnswer, svgContent]);

  const handleContinue = () => {
    onComplete(totalScore, responses);
  };

  const correctCount = responses.filter(r => r.correcta).length;

  if (showFinalFeedback) {
    return (
      <div className="min-h-screen flex flex-col bg-[#ECEEEF]">
        <Header />
        <main className="pt-14 md:pt-24 flex-1 px-3 md:px-4 pb-8 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#2167AE] px-4 md:px-8 py-4 md:py-6 text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Nivel 3 completado</h2>
              <p className="text-blue-100 text-sm">Antes, Durante y Después del desastre</p>
            </div>
            <div className="px-4 md:px-8 py-4 md:py-6">
              <div className="flex gap-3 md:gap-6 mb-4 md:mb-6">
                <div className="flex-1 bg-[#EAF4FB] rounded-xl p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#2167AE]">{correctCount}/9</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Respuestas correctas</p>
                </div>
                <div className="flex-1 bg-[#E8F8F2] rounded-xl p-3 md:p-4 text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#27AE60]">{totalScore}</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">Puntos obtenidos</p>
                </div>
              </div>

              <div className="bg-[#F0F4FF] rounded-xl p-3 md:p-5 mb-4 md:mb-6">
                <p className="text-[#1E2D6B] text-xs md:text-sm leading-relaxed">
                  Conocer qué hacer antes, durante y después de un desastre puede salvar vidas.
                  La preparación anticipada reduce el impacto, actuar con calma durante la emergencia
                  protege a todos, y las acciones post-desastre permiten recuperar la normalidad de forma segura.
                </p>
              </div>

              <div className="space-y-2 mb-4 md:mb-6 max-h-64 overflow-y-auto pr-1">
                {responses.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ${
                      r.correcta ? 'bg-[#E8F8F2] text-[#1E5E38]' : 'bg-[#FEF0F0] text-[#7B1D1D]'
                    }`}
                  >
                    <span className="mt-0.5 flex-shrink-0">
                      {r.correcta ? (
                        <svg className="w-4 h-4 text-[#27AE60]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#E74C3C]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{r.accion}</p>
                      {!r.correcta && (
                        <p className="text-xs mt-0.5 opacity-75">
                          Tu respuesta: {r.respuesta_dada} &mdash; Correcta: {actions[i].categoria}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-3 bg-[#2167AE] hover:bg-[#1a5490] text-white font-bold rounded-xl transition-colors text-sm md:text-lg min-h-[44px]"
              >
                Continuar al Mapa
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#f95966]" style={{ height: '100vh', overflow: 'hidden' }}>
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden" style={{ paddingTop: '48px' }}>
        <div className="flex-1 relative overflow-hidden">
          {svgContent && (
            <div
              ref={containerRef}
              dangerouslySetInnerHTML={{ __html: svgContent }}
              style={{ width: '100%', height: '100%', lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          )}
        </div>

        {answerState !== 'idle' && (
          <div
            className="fixed left-0 right-0 flex justify-center z-50 pointer-events-none"
            style={{ top: '15%' }}
          >
            <div
              className={`mx-4 rounded-2xl px-6 py-3 text-white text-center font-bold text-base shadow-2xl transition-all duration-300 ${
                answerState === 'correct' ? 'bg-[#27AE60]/90' : 'bg-[#E74C3C]/90'
              }`}
              style={{ backdropFilter: 'blur(4px)', maxWidth: '480px' }}
            >
              {answerState === 'correct'
                ? `Correcto! "${currentAction?.accion}" es una acción de ${currentAction?.categoria}.`
                : `Incorrecto. La respuesta correcta es ${currentAction?.categoria}.`
              }
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
