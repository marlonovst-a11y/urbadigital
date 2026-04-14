export interface SessionData {
  sessionStart: number;
  sessionExpiry: number;
  gameCompleted: boolean;
  nickname?: string;
  finalScore?: number;
}

const SESSION_KEY = 'game_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export function createSession(nickname: string): SessionData {
  const now = Date.now();
  const sessionData: SessionData = {
    sessionStart: now,
    sessionExpiry: now + SESSION_DURATION,
    gameCompleted: false,
    nickname,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  return sessionData;
}

export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const session: SessionData = JSON.parse(sessionStr);
    return session;
  } catch {
    return null;
  }
}

export function isSessionExpired(session: SessionData): boolean {
  return Date.now() > session.sessionExpiry;
}

export function markGameCompleted(finalScore: number): void {
  const session = getSession();
  if (!session) return;

  session.gameCompleted = true;
  session.finalScore = finalScore;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getExpiryDateTime(session: SessionData): { date: string; time: string } {
  const expiryDate = new Date(session.sessionExpiry);

  const date = expiryDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const time = expiryDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { date, time };
}

export type SessionStatus =
  | { type: 'none' }
  | { type: 'active_incomplete'; session: SessionData }
  | { type: 'active_completed'; session: SessionData }
  | { type: 'expired'; session: SessionData };

export function checkSessionStatus(): SessionStatus {
  const session = getSession();

  if (!session) {
    return { type: 'none' };
  }

  if (isSessionExpired(session)) {
    clearSession();
    return { type: 'expired', session };
  }

  if (session.gameCompleted) {
    return { type: 'active_completed', session };
  }

  return { type: 'active_incomplete', session };
}
