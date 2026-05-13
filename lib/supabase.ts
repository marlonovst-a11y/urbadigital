import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export async function createParticipantInitial(
  nickname: string,
  edad: string,
  genero: string,
  ocupacion: string
) {
  const { data, error } = await supabase
    .from('participantes')
    .insert([{ nickname, edad, genero, ocupacion }])
    .select()
    .single();
  if (error) {
    console.error('[supabase] Insert error:', error);
    return null;
  }
  console.log('[supabase] Created:', data);
  return data;
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

export function updateParticipantDemographics(id: string, edad: string, genero: string, ocupacion: string): Promise<boolean> {
  console.log(`Saving to Supabase: edad = ${edad}, genero = ${genero}, ocupacion = ${ocupacion} for participant ${id}`);
  // Wrapped in a plain Promise to prevent any surrounding AbortController / React
  // request context from cancelling this fetch before it completes.
  return new Promise((resolve) => {
    supabase
      .from('participantes')
      .update({ edad, genero, ocupacion, updated_at: new Date().toISOString() })
      .eq('id', id)
      .then(
        ({ error }) => {
          if (error) {
            console.error('Error updateParticipantDemographics:', error);
            resolve(false);
          } else {
            resolve(true);
          }
        },
        (e: unknown) => {
          console.error('Error updateParticipantDemographics:', e);
          resolve(false);
        }
      );
  });
}

export async function updateParticipantScore(id: string, level: number, score: number, responses: Record<string, any>, newTotal: number): Promise<boolean> {
  console.log(`Saving to Supabase: puntaje_nivel_${level} = ${score} for participant ${id}`);
  console.log(`Saving to Supabase: puntaje_total = ${newTotal} for participant ${id}`);
  try {
    const { error } = await supabase
      .from('participantes')
      .update({
        [`puntaje_nivel_${level}`]: score,
        [`respuestas_nivel_${level}`]: responses,
        puntaje_total: newTotal,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) {
      console.error('Error updateParticipantScore:', error);
      return false;
    }
    console.log(`[updateParticipantScore] Saved level=${level}`);
    return true;
  } catch (e) {
    console.error('Error updateParticipantScore:', e);
    return false;
  }
}

export async function updateFinalEvaluation(id: string, evaluationResponses: Record<string, any>, startTime: number, totalBeforeEval: number): Promise<boolean> {
  const finalScore = totalBeforeEval + 10;
  const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  console.log(`Saving to Supabase: puntaje_formulario = 10 for participant ${id}`);
  console.log(`Saving to Supabase: puntaje_total = ${finalScore} for participant ${id}`);
  try {
    const { error } = await supabase
      .from('participantes')
      .update({
        puntaje_formulario: 10,
        puntaje_total: finalScore,
        tiempo_total: timeElapsed,
        respuestas_evaluacion: evaluationResponses,
        fecha_hora: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) {
      console.error('Error updateFinalEvaluation:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error updateFinalEvaluation:', e);
    return false;
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
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('participantes')
      .select('created_at')
      .eq('nickname', nickname)
      .gte('created_at', threeHoursAgo)
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) return { played: false };
    if (data && data.length > 0) {
      const nextAvailable = new Date(new Date(data[0].created_at).getTime() + 3 * 60 * 60 * 1000);
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