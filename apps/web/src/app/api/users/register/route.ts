import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Registering user:', data);
    
    // Forward the request to your backend server
    const response = await fetch('http://localhost:3001/api/users/register', {
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
    console.log('Backend response:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in user registration:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 