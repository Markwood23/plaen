import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { computeReceiptVerificationHash } from '@/lib/receipts/verification';

type ReceiptRow = {
  id: string;
  receipt_number: string;
  payment_id: string;
  invoice_id: string | null;
  snapshot_data: unknown;
  created_at: string | null;
};

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

function extractBaseSnapshotData(snapshotData: unknown): unknown {
  if (!snapshotData || typeof snapshotData !== 'object') return snapshotData;
  if (Array.isArray(snapshotData)) return snapshotData;

  const obj = { ...(snapshotData as Record<string, unknown>) };
  delete obj.verification;
  return obj;
}

// GET /api/verify/[hash] - Public receipt verification
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;
    const input = (hash || '').trim().toLowerCase();

    if (input.length < 8) {
      return NextResponse.json(
        { valid: false, error: 'Hash is too short' },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { valid: false, error: 'Server not configured' },
        { status: 500 }
      );
    }

    // Fast path: exact hash match stored in snapshot_data.verification.hash
    const { data: exactMatches } = await supabase
      .from('receipt_snapshots')
      .select('id, receipt_number, payment_id, invoice_id, snapshot_data, created_at')
      .contains('snapshot_data', { verification: { hash: input } })
      .limit(1);

    const exact = (exactMatches?.[0] || null) as ReceiptRow | null;
    if (exact) {
      const verification =
        exact.snapshot_data &&
        typeof exact.snapshot_data === 'object' &&
        !Array.isArray(exact.snapshot_data)
          ? (exact.snapshot_data as any).verification
          : null;

      return NextResponse.json({
        valid: true,
        match: {
          receipt_id: exact.id,
          receipt_number: exact.receipt_number,
          invoice_id: exact.invoice_id,
          payment_id: exact.payment_id,
          created_at: exact.created_at,
          algo: verification?.algo || 'sha256',
          hash: verification?.hash || input,
          hash_tail: verification?.tail || input.slice(-10),
        },
      });
    }

    // Fallback: support tail lookups and older receipts without stored verification hash.
    // We scan a bounded recent set to keep runtime predictable.
    const { data: recent } = await supabase
      .from('receipt_snapshots')
      .select('id, receipt_number, payment_id, invoice_id, snapshot_data, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    for (const row of (recent || []) as ReceiptRow[]) {
      const snapshotObj = row.snapshot_data;

      const storedVerification =
        snapshotObj &&
        typeof snapshotObj === 'object' &&
        !Array.isArray(snapshotObj)
          ? (snapshotObj as any).verification
          : null;

      const storedHash = typeof storedVerification?.hash === 'string' ? storedVerification.hash.toLowerCase() : null;
      const storedTail = typeof storedVerification?.tail === 'string' ? storedVerification.tail.toLowerCase() : null;

      if (storedHash && (storedHash === input || storedHash.endsWith(input))) {
        return NextResponse.json({
          valid: true,
          match: {
            receipt_id: row.id,
            receipt_number: row.receipt_number,
            invoice_id: row.invoice_id,
            payment_id: row.payment_id,
            created_at: row.created_at,
            algo: storedVerification?.algo || 'sha256',
            hash: storedHash,
            hash_tail: storedTail || storedHash.slice(-10),
          },
        });
      }

      const base = extractBaseSnapshotData(snapshotObj);
      const computed = computeReceiptVerificationHash(base);
      if (computed.hash === input || computed.hash.endsWith(input)) {
        return NextResponse.json({
          valid: true,
          match: {
            receipt_id: row.id,
            receipt_number: row.receipt_number,
            invoice_id: row.invoice_id,
            payment_id: row.payment_id,
            created_at: row.created_at,
            algo: 'sha256',
            hash: computed.hash,
            hash_tail: computed.tail,
          },
        });
      }
    }

    return NextResponse.json({ valid: false, error: 'No matching receipt found' }, { status: 404 });
  } catch (error) {
    console.error('Error in GET /api/verify/[hash]:', error);
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
  }
}
