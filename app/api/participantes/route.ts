export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('participantes')
    .select('*')
    .order('puntaje_total', { ascending: false });

  if (error) {
    console.error('[GET /api/participantes] Error:', error);
    return NextResponse.json([], { status: 200 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nickname, edad, genero, ocupacion } = body;

  console.log('[POST /api/participantes] Creating participant:', { nickname, edad, genero, ocupacion });

  const { data, error } = await supabase
    .from('participantes')
    .insert([{ nickname, edad: edad ?? null, genero: genero ?? null, ocupacion: ocupacion ?? null }])
    .select()
    .single();

  if (error) {
    console.error('[POST /api/participantes] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  console.log('[PATCH /api/participantes] Updating participant:', id, fields);

  const { data, error } = await supabase
    .from('participantes')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[PATCH /api/participantes] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log('[PATCH /api/participantes] Updated successfully:', data?.id);
  return NextResponse.json(data);
}
