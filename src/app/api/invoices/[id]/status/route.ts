import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Return pending status for testing
  return NextResponse.json({
    status: 'pending',
    expires_at: '2024-12-31T23:59:59Z',
  });
}
