import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    
    return NextResponse.json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
} 