import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


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
    .insert([{ nickname: nickname.toLowerCase(), edad, genero, ocupacion }])
    .select()
    .single();
  if (error) {
    console.error('[supabase] Insert error:', error);
    return null;
  }
  console.log('[supabase] Created:', data);
  return data;
}


export async function getParticipant(id: string): Promise<Participant | null> {
  const { data, error } = await supabase
    .from('participantes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Error getParticipant:', error);
    return null;
  }
  return data;
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
  const { data, error } = await supabase
    .from('participantes')
    .select('id, nickname, puntaje_total')
    .order('puntaje_total', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error getTopRanking:', error);
    return [];
  }
  return (data ?? []).map((entry, index) => ({ ...entry, position: index + 1 }));
}

export async function getParticipantRanking(participantId: string): Promise<{ position: number; totalParticipants: number } | null> {
  const { data, error } = await supabase
    .from('participantes')
    .select('id, puntaje_total')
    .order('puntaje_total', { ascending: false });
  if (error) {
    console.error('Error getParticipantRanking:', error);
    return null;
  }
  const all = data ?? [];
  const position = all.findIndex((p) => p.id === participantId);
  if (position === -1) return null;
  return { position: position + 1, totalParticipants: all.length };
}

const COOLDOWN_MS = 30 * 60 * 1000;

export async function checkNicknameRecentPlay(nickname: string): Promise<{ played: boolean; nextAvailable?: Date }> {
  try {
    const cutoff = new Date(Date.now() - COOLDOWN_MS).toISOString();
    const { data, error } = await supabase
      .from('participantes')
      .select('created_at')
      .eq('nickname', nickname.toLowerCase())
      .gte('created_at', cutoff)
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) return { played: false };
    if (data && data.length > 0) {
      const nextAvailable = new Date(new Date(data[0].created_at).getTime() + COOLDOWN_MS);
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