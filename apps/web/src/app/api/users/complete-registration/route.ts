import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Completing registration:', data);
    
    const response = await fetch('http://localhost:3001/api/users/complete-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = await response.json();
    console.log('Registration completed:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json(
      { error: 'Failed to complete registration' },
      { status: 500 }
    );
  }
} 