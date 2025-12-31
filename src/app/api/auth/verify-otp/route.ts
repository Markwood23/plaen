import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitedResponse } from '@/lib/rate-limit';

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

// POST /api/auth/verify-otp - Verify OTP code
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.auth.verifyOtp);
    if (!rateLimitResult.success) {
      return rateLimitedResponse(rateLimitResult);
    }

    const body = await request.json();
    const { email, code, userId } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      );
    }

    // Find the user
    let user;
    if (userId) {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, otp_code, otp_expires_at, full_name')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      user = data;
    } else {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, otp_code, otp_expires_at, full_name')
        .eq('email', email)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      user = data;
    }

    // Check if OTP exists
    if (!user.otp_code) {
      return NextResponse.json(
        { success: false, error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (user.otp_expires_at) {
      const expiresAt = new Date(user.otp_expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { success: false, error: 'Verification code has expired. Please request a new one.' },
          { status: 400 }
        );
      }
    }

    // Verify OTP
    if (user.otp_code !== code) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // OTP is valid - mark email as verified and clear OTP
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        otp_code: null,
        otp_expires_at: null,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user verification:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to verify email' },
        { status: 500 }
      );
    }

    // Also update Supabase auth user metadata if possible
    try {
      await supabase.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });
    } catch (e) {
      // This might fail if using older Supabase version, that's okay
      console.warn('Could not update auth email_confirmed:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
