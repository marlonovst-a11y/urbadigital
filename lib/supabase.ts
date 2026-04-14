// Conexión via API Routes → PostgreSQL directo

const TIMEOUT_MS = 3000;

function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}

export interface Participant {
  id: string;
  nickname: string;
  edad: string;
  genero: string;
  ocupacion: string;
  puntaje_nivel_1: number;
  puntaje_nivel_2: number;
  puntaje_nivel_3: number;
  puntaje_nivel_4: number;
  puntaje_nivel_5: number;
  puntaje_formulario: number;
  puntaje_total: number;
  tiempo_total: number;
  fecha_hora: string;
  respuestas_nivel_1: Record<string, any> | null;
  respuestas_nivel_2: Record<string, any> | null;
  respuestas_nivel_3: Record<string, any> | null;
  respuestas_nivel_4: Record<string, any> | null;
  respuestas_nivel_5: Record<string, any> | null;
  respuestas_evaluacion: Record<string, any> | null;
}

export interface RankingEntry {
  id: string;
  nickname: string;
  puntaje_total: number;
  position?: number;
}

export async function createParticipantInitial(nickname: string): Promise<Participant | null> {
  try {
    const res = await fetchWithTimeout('/api/participantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname })
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (e) {
    console.error('Error createParticipantInitial:', e);
    return null;
  }
}

export async function createParticipant(nickname: string, edad: string, genero: string, ocupacion: string): Promise<Participant | null> {
  try {
    const res = await fetchWithTimeout('/api/participantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, edad, genero, ocupacion })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Error createParticipant:', e);
    return null;
  }
}

export async function getParticipant(id: string): Promise<Participant | null> {
  try {
    const res = await fetchWithTimeout('/api/participantes');
    if (!res.ok) return null;
    const all = await res.json();
    return all.find((p: Participant) => p.id === id) || null;
  } catch (e) {
    console.error('Error getParticipant:', e);
    return null;
  }
}

export async function updateParticipantDemographics(id: string, edad: string, genero: string, ocupacion: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout('/api/participantes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, edad, genero, ocupacion })
    });
    return res.ok;
  } catch (e) {
    console.error('Error updateParticipantDemographics:', e);
    return true; // continuar aunque falle
  }
}

export async function updateParticipantScore(id: string, level: number, score: number, responses: Record<string, any>): Promise<boolean> {
  try {
    const res = await fetchWithTimeout('/api/participantes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        [`puntaje_nivel_${level}`]: score,
        [`respuestas_nivel_${level}`]: responses
      })
    });
    return res.ok;
  } catch (e) {
    console.error('Error updateParticipantScore:', e);
    return true; // continuar aunque falle
  }
}

export async function updateFinalEvaluation(id: string, evaluationResponses: Record<string, any>, startTime: number): Promise<boolean> {
  try {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const resGet = await fetchWithTimeout('/api/participantes');
    const all = await resGet.json();
    const participant = all.find((p: Participant) => p.id === id);
    const finalScore = (participant?.puntaje_total || 0) + 10;

    const res = await fetchWithTimeout('/api/participantes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        puntaje_formulario: 10,
        puntaje_total: finalScore,
        tiempo_total: timeElapsed,
        respuestas_evaluacion: evaluationResponses,
        fecha_hora: new Date().toISOString()
      })
    });
    return res.ok;
  } catch (e) {
    console.error('Error updateFinalEvaluation:', e);
    return true; // continuar aunque falle
  }
}

export async function getTopRanking(limit: number = 10): Promise<RankingEntry[]> {
  try {
    const res = await fetchWithTimeout('/api/ranking');
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((entry: RankingEntry, index: number) => ({
      ...entry,
      position: index + 1
    }));
  } catch (e) {
    console.error('Error getTopRanking:', e);
    return [];
  }
}

export async function getParticipantRanking(participantId: string): Promise<{ position: number; totalParticipants: number } | null> {
  try {
    const res = await fetchWithTimeout('/api/ranking');
    if (!res.ok) return null;
    const all = await res.json();
    const position = all.findIndex((p: RankingEntry) => p.id === participantId);
    if (position === -1) return null;
    return { position: position + 1, totalParticipants: all.length };
  } catch (e) {
    console.error('Error getParticipantRanking:', e);
    return null;
  }
}

export async function checkNicknameRecentPlay(nickname: string): Promise<{ played: boolean; nextAvailable?: Date }> {
  try {
    const res = await fetchWithTimeout('/api/participantes');
    if (!res.ok) return { played: false };
    const all = await res.json();
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const recent = all.find((p: Participant) =>
      p.nickname === nickname &&
      p.puntaje_formulario === 10 &&
      new Date(p.fecha_hora) > threeHoursAgo
    );
    if (recent) {
      const nextAvailable = new Date(new Date(recent.fecha_hora).getTime() + 3 * 60 * 60 * 1000);
      return { played: true, nextAvailable };
    }
    return { played: false };
  } catch (e) {
    console.error('Error checkNicknameRecentPlay:', e);
    return { played: false };
  }
}

export async function checkNicknameCooldown(nickname: string): Promise<{ played: boolean; nextAvailable?: Date }> {
  return checkNicknameRecentPlay(nickname);
}