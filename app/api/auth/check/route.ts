import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userCookie = cookies().get('user');
    
    if (!userCookie?.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

