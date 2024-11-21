import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { clerkId, username } = await req.json();
    console.log(clerkId, username);
    
    await sql`
      INSERT INTO users (id, username)
      VALUES (${clerkId}, ${username})
    `;
    return NextResponse.json({ status: 'success' });
  }
  catch(error) {
    return NextResponse.json({ error: 'Failed to register user!' }, { status: 500 });
  }
}