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
      
      throw new Error(errorData.error || 'Failed to save registration data');
    }

    const result = JSON.parse(responseText);
    console.log('Backend response:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in initial registration:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Failed to process registration',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 