import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    // Forward the request to the backend
    const response = await fetch('http://localhost:3001/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    
    // Return the response with cookies
    const res = NextResponse.json(data);
    
    // Set the session cookie
    res.cookies.set('session', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Set registration status cookie if available
    if (data.user?.registrationStatus) {
      res.cookies.set('registration_complete', 
        data.user.registrationStatus === 'COMPLETE' ? '1' : '0',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 day
        }
      );
    }

    return res;
  } catch (error) {
    console.error('Error in sign-in:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
} 