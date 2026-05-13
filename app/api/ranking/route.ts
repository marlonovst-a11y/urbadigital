export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('participantes')
    .select('id, nickname, puntaje_total')
    .order('puntaje_total', { ascending: false })
    .limit(100);

  if (error) {
    console.error('[GET /api/ranking] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
  return NextResponse.json(data ?? []);
}
