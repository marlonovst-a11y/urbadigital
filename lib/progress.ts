export interface ProgressData {
  participanteId: string;
  nickname: string;
  edad?: string;
  genero?: string;
  ocupacion?: string;
  nivel1Completado: boolean;
  nivel1Puntaje: number;
  nivel2Completado: boolean;
  nivel2Puntaje: number;
  nivel3Completado: boolean;
  nivel3Puntaje: number;
  nivel4Completado: boolean;
  nivel4Puntaje: number;
  nivel5Completado: boolean;
  nivel5Puntaje: number;
  evaluacionCompletada: boolean;
  ultimoNivel: number;
  timestamp: string;
}

const STORAGE_KEY = 'climateguardians_progress';

export function saveProgress(data: Partial<ProgressData>): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = loadProgress();
    const updated = {
      ...existing,
      ...data,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function loadProgress(): ProgressData | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as ProgressData;
  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
}

export function hasIncompleteSession(): boolean {
  const progress = loadProgress();
  if (!progress) return false;

  return !!(
    progress.participanteId &&
    progress.nickname &&
    !progress.evaluacionCompletada
  );
}

export function getLastCompletedLevel(progress: ProgressData): number {
  if (progress.nivel5Completado) return 5;
  if (progress.nivel4Completado) return 4;
  if (progress.nivel3Completado) return 3;
  if (progress.nivel2Completado) return 2;
  if (progress.nivel1Completado) return 1;
  return 0;
}
