import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { clerkId, username } = await req.json();
    await query('INSERT INTO users (id, username) VALUES ($1, $2)', [clerkId, username]);
    return NextResponse.json({ status: 'success' });
  }
  catch(error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}