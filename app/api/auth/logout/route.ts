import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.delete('token');

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}