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

    console.log('Backend response status:', response.status);
    const responseText = await response.text();
    console.log('Backend raw response:', responseText);

    if (!response.ok) {
      console.error('Backend error status:', response.status);
      console.error('Backend error response:', responseText);
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { error: responseText || 'Unknown error occurred' };
      }
      
      return NextResponse.json(errorData, { status: response.status });
    }

    const result = JSON.parse(responseText);
    console.log('Backend response:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in user registration:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to register user', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 