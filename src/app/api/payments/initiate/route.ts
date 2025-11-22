import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock response
    return NextResponse.json({
      transaction_id: `TXN-${Date.now()}`,
      status: 'pending',
      message: 'Payment initiated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
