export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ id: 'local-' + Date.now() });
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json({ success: true });
}