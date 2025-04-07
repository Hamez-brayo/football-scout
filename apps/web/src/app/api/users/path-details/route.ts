import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Saving path details:', data);
    
    const response = await fetch('http://localhost:3001/api/users/path-details', {
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
    console.log('Path details saved:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving path details:', error);
    return NextResponse.json(
      { error: 'Failed to save path details' },
      { status: 500 }
    );
  }
} 