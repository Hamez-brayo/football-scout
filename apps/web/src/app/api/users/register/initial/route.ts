import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received registration data:', JSON.stringify(data, null, 2));
    
    // Forward the request to your backend server
    const response = await fetch('http://localhost:3001/api/users/register/initial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', JSON.stringify(errorData, null, 2));
      console.error('Response status:', response.status);
      throw new Error(errorData.error || 'Failed to save registration data');
    }

    const result = await response.json();
    console.log('Backend response:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in initial registration:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
} 