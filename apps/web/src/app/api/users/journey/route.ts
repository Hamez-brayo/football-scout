import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Saving journey data:', data);
    
    const response = await fetch('http://localhost:3001/api/users/journey', {
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
    console.log('Journey data saved:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving journey data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save journey data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 