import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { sendOTPEmail, isEmailConfigured } from '@/lib/email/mailjet';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS, rateLimitedResponse } from '@/lib/rate-limit';

function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createServiceClient(supabaseUrl, serviceRoleKey);
}

function generateOTP(): string {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-otp - Send OTP verification code to email
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - same limit as forgotPassword since it sends emails
    const clientId = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.auth.forgotPassword);
    if (!rateLimitResult.success) {
      return rateLimitedResponse(rateLimitResult);
    }

    const body = await request.json();
    const { email, name, userId } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Server not configured' },
        { status: 500 }
      );
    }

    // Generate OTP and set expiry (10 minutes)
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    if (userId) {
      // If we have userId, update that user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          otp_code: otp,
          otp_expires_at: expiresAt.toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error storing OTP:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to store verification code' },
          { status: 500 }
        );
      }
    } else {
      // Find user by email and update
      const { data: user, error: findError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (findError || !user) {
        // User doesn't exist yet - store in a temp table or session
        // For now, we'll create/update a verification record
        const { error: upsertError } = await supabase
          .from('email_verifications')
          .upsert(
            {
              email,
              otp_code: otp,
              otp_expires_at: expiresAt.toISOString(),
              created_at: new Date().toISOString(),
            },
            { onConflict: 'email' }
          );

        // If table doesn't exist, that's okay - we'll still send the email
        // The verification will need to handle this case
        if (upsertError) {
          console.warn('Could not store OTP in email_verifications:', upsertError);
        }
      } else {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            otp_code: otp,
            otp_expires_at: expiresAt.toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error storing OTP:', updateError);
        }
      }
    }

    // Send OTP email
    const result = await sendOTPEmail({
      email,
      name: name || undefined,
      code: otp,
      expiryMinutes: 10,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      expiresIn: 600, // 10 minutes in seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
