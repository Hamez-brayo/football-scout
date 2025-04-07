import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    console.log('Fetching user data for:', userId);
    
    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const userData = await response.json();
    console.log('User data fetched:', userData);
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 