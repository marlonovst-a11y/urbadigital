'use client';

import { useState, useEffect } from 'react';
import Welcome from '@/components/Welcome';
import NicknameInput from '@/components/NicknameInput';
import DiagnosticForm, { DiagnosticData } from '@/components/DiagnosticForm';
import LevelMap from '@/components/LevelMap';
import Level1 from '@/components/Level1';
import Level2 from '@/components/Level2';
import Level3 from '@/components/Level3';
import Level4 from '@/components/Level4';
import Level5 from '@/components/Level5';
import FinalEvaluation from '@/components/FinalEvaluation';
import FinalScore from '@/components/FinalScore';
import Closing from '@/components/Closing';
import SessionRecoveryDialog from '@/components/SessionRecoveryDialog';
import { createParticipantInitial, updateParticipantDemographics, updateParticipantScore, getParticipant, updateFinalEvaluation } from '@/lib/supabase';
import { saveProgress, loadProgress, clearProgress, hasIncompleteSession, getLastCompletedLevel } from '@/lib/progress';
import { clearSession } from '@/lib/session';

type Screen = 'welcome' | 'nickname' | 'diagnostic' | 'levelmap' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'finalevaluation' | 'finalscore' | 'closing';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [nickname, setNickname] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [levelScores, setLevelScores] = useState({
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    evaluation: 0
  });
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryData, setRecoveryData] = useState<any>(null);
  useEffect(() => {
    if (hasIncompleteSession()) {
      const progress = loadProgress();
      if (progress && progress.participanteId) {
        setRecoveryData(progress);
        setShowRecoveryDialog(true);
      }
    }
  }, []);

  const handleStartClick = () => {
    setScreen('nickname');
  };

  const handleNicknameSubmit = async (name: string) => {
    console.log('[handleNicknameSubmit] Called with nickname:', name);

    clearSession();
    clearProgress();

   let participant = await createParticipantInitial(name);
console.log('[handleNicknameSubmit] Participant returned:', participant);
    if (!participant) {
  participant = {
    id: 'local-' + Date.now(),
    nickname: name,
    edad: '', genero: '', ocupacion: '',
    puntaje_nivel_1: 0, puntaje_nivel_2: 0,
    puntaje_nivel_3: 0, puntaje_nivel_4: 0,
    puntaje_nivel_5: 0, puntaje_formulario: 0,
    puntaje_total: 0, tiempo_total: 0,
    fecha_hora: new Date().toISOString(),
    respuestas_nivel_1: null, respuestas_nivel_2: null,
    respuestas_nivel_3: null, respuestas_nivel_4: null,
    respuestas_nivel_5: null, respuestas_evaluacion: null
  };
}

    if (participant) {
      console.log('[handleNicknameSubmit] Setting state with participant ID:', participant.id);
      setNickname(name);
      setParticipantId(participant.id);
      setStartTime(Math.floor(Date.now() / 1000));

      saveProgress({
        participanteId: participant.id,
        nickname: name,
        edad: '',
        genero: '',
        ocupacion: '',
        nivel1Completado: false,
        nivel1Puntaje: 0,
        nivel2Completado: false,
        nivel2Puntaje: 0,
        nivel3Completado: false,
        nivel3Puntaje: 0,
        nivel4Completado: false,
        nivel4Puntaje: 0,
        nivel5Completado: false,
        nivel5Puntaje: 0,
        evaluacionCompletada: false,
        ultimoNivel: 0,
        timestamp: new Date().toISOString()
      });

      console.log('[handleNicknameSubmit] Moving to diagnostic screen');
      setScreen('diagnostic');
    } else {
      console.error('[handleNicknameSubmit] Failed to create participant - participant is null');
    }
  };

const handleDiagnosticSubmit = async (data: DiagnosticData) => {
    if (participantId) {
      updateParticipantDemographics(
        participantId,
        data.edad,
        data.genero,
        data.ocupacion
      ); // No esperamos respuesta
    }
    saveProgress({
      edad: data.edad,
      genero: data.genero,
      ocupacion: data.ocupacion
    });
    setScreen('levelmap');
  };
  const handleStartLevel = (level: number) => {
    if (level === 1) {
      setScreen('level1');
    } else if (level === 2) {
      setScreen('level2');
    } else if (level === 3) {
      setScreen('level3');
    } else if (level === 4) {
      setScreen('level4');
    } else if (level === 5) {
      setScreen('level5');
    }
  };

  const handleLevelComplete = async (level: number, score: number, responses: any) => {
    // Actualizar puntaje local inmediatamente
    setLevelScores(prev => ({
      ...prev,
      [`level${level}`]: score
    }));
    setTotalScore(prev => prev + score);
    
    if (!completedLevels.includes(level)) {
      setCompletedLevels(prev => [...prev, level]);
    }

    const progressUpdate: any = {
      ultimoNivel: level,
      [`nivel${level}Completado`]: true,
      [`nivel${level}Puntaje`]: score
    };
    saveProgress(progressUpdate);

    // Guardar en BD sin bloquear
    if (participantId) {
      updateParticipantScore(participantId, level, score, { responses });
    }

    setScreen('levelmap');
  };

  const handleFinalEvaluationComplete = async (responses: { pregunta_1: string; pregunta_2: string; pregunta_3: string }) => {
    if (participantId) {
      await updateFinalEvaluation(participantId, responses, startTime);
      const participant = await getParticipant(participantId);
      if (participant) {
        setTotalScore(participant.puntaje_total);
        setLevelScores(prev => ({
          ...prev,
          evaluation: 10
        }));
      }

      saveProgress({
        evaluacionCompletada: true
      });
    }
    setScreen('finalscore');
  };

  const handleFinishApp = () => {
    clearProgress();
    setScreen('closing');
  };

  const handlePlayAgain = () => {
    clearProgress();
    clearSession();
    setScreen('welcome');
    setNickname('');
    setParticipantId('');
    setTotalScore(0);
    setCompletedLevels([]);
    setStartTime(0);
    setLevelScores({
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
      evaluation: 0
    });
  };


  const handleContinueSession = async () => {
    if (recoveryData) {
      setNickname(recoveryData.nickname);
      setParticipantId(recoveryData.participanteId);

      const participant = await getParticipant(recoveryData.participanteId);
      if (participant) {
        setTotalScore(participant.puntaje_total);

        const completed: number[] = [];
        const scores: any = {
          level1: 0,
          level2: 0,
          level3: 0,
          level4: 0,
          level5: 0,
          evaluation: 0
        };

        if (recoveryData.nivel1Completado) {
          completed.push(1);
          scores.level1 = recoveryData.nivel1Puntaje;
        }
        if (recoveryData.nivel2Completado) {
          completed.push(2);
          scores.level2 = recoveryData.nivel2Puntaje;
        }
        if (recoveryData.nivel3Completado) {
          completed.push(3);
          scores.level3 = recoveryData.nivel3Puntaje;
        }
        if (recoveryData.nivel4Completado) {
          completed.push(4);
          scores.level4 = recoveryData.nivel4Puntaje;
        }
        if (recoveryData.nivel5Completado) {
          completed.push(5);
          scores.level5 = recoveryData.nivel5Puntaje;
        }

        setCompletedLevels(completed);
        setLevelScores(scores);
      }

      setShowRecoveryDialog(false);
      setScreen('levelmap');
    }
  };

  const handleStartNewSession = () => {
    clearProgress();
    setShowRecoveryDialog(false);
  };

  const handleGoToEvaluation = () => {
    setScreen('finalevaluation');
  };

  const handleDevFinalScore = () => {
    setNickname('Usuario Demo');
    setParticipantId('demo-participant-id');
    setTotalScore(95);
    setLevelScores({
      level1: 18,
      level2: 16,
      level3: 19,
      level4: 17,
      level5: 25,
      evaluation: 10
    });
    setScreen('finalscore');
  };

  const handleDevNav = (target: Screen) => {
    setNickname('Test');
    setParticipantId('dev-123');
    setScreen(target);
  };

  return (
    <>
      {(
        <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999, background: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '6px 10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
          {([
            { label: 'N1', screen: 'level1' },
            { label: 'N2', screen: 'level2' },
            { label: 'N3', screen: 'level3' },
            { label: 'N4', screen: 'level4' },
            { label: 'N5', screen: 'level5' },
            { label: 'Eval', screen: 'finalevaluation' },
            { label: 'Score', screen: 'finalscore' },
          ] as { label: string; screen: Screen }[]).map(({ label, screen: s }) => (
            <button
              key={s}
              onClick={() => handleDevNav(s)}
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <SessionRecoveryDialog
        open={showRecoveryDialog}
        nickname={recoveryData?.nickname || ''}
        onContinue={handleContinueSession}
        onStartNew={handleStartNewSession}
      />

      {screen === 'welcome' && (
        <div onClick={handleStartClick}>
          <Welcome />
        </div>
      )}
      {screen === 'nickname' && (
        <NicknameInput onContinue={handleNicknameSubmit} />
      )}
      {screen === 'diagnostic' && (
        <DiagnosticForm onComplete={handleDiagnosticSubmit} />
      )}
      {screen === 'levelmap' && (
        <LevelMap
          totalScore={totalScore}
          nickname={nickname}
          participantId={participantId}
          completedLevels={completedLevels}
          onStartLevel={handleStartLevel}
          onGoToEvaluation={handleGoToEvaluation}
        />
      )}
      {screen === 'level1' && (
        <Level1
          participantId={participantId}
          nickname={nickname}
          onComplete={(score, responses) => handleLevelComplete(1, score, responses)}
        />
      )}
      {screen === 'level2' && (
        <Level2
          participantId={participantId}
          nickname={nickname}
          onComplete={(score, responses) => handleLevelComplete(2, score, responses)}
        />
      )}
      {screen === 'level3' && (
        <Level3
          participantId={participantId}
          nickname={nickname}
          onComplete={(score, responses) => handleLevelComplete(3, score, responses)}
        />
      )}
      {screen === 'level4' && (
        <Level4
          participantId={participantId}
          nickname={nickname}
          onComplete={(score, responses) => handleLevelComplete(4, score, responses)}
        />
      )}
      {screen === 'level5' && (
        <Level5
          participantId={participantId}
          nickname={nickname}
          onComplete={(score, responses) => handleLevelComplete(5, score, responses)}
        />
      )}
      {screen === 'finalevaluation' && (
        <FinalEvaluation
          participantId={participantId}
          nickname={nickname}
          onComplete={handleFinalEvaluationComplete}
        />
      )}
      {screen === 'finalscore' && (
        <FinalScore
          participantId={participantId}
          nickname={nickname}
          totalScore={totalScore}
          levelScores={levelScores}
          onContinue={handleFinishApp}
        />
      )}
      {screen === 'closing' && (
        <Closing onPlayAgain={handlePlayAgain} totalScore={totalScore} />
      )}
    </>
  );
}
