import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: transactionId } = await params;
  
  // For demo purposes, simulate successful payment after a delay
  // In production, this would check actual payment provider status
  return NextResponse.json({
    transaction_id: transactionId,
    status: 'success',
    amount: 2000,
    timestamp: new Date().toISOString(),
    invoice_number: 'INV-2024-001',
    reference: 'MTN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  });
}
