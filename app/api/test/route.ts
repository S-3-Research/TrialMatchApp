import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[TEST API] GET request received');
  return NextResponse.json({ message: 'Test API works!' });
}

export async function POST() {
  console.log('[TEST API] POST request received');
  return NextResponse.json({ message: 'Test POST works!' });
}
