import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendAccountDeletedEmail, isEmailConfigured } from '@/lib/email/mailjet'

/**
 * DELETE /api/user/delete
 * 
 * Delete user account with password verification.
 * This is an alternative endpoint that requires password confirmation.
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required to delete account' },
        { status: 400 }
      )
    }

    // Verify password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 400 }
      )
    }

    // Password verified - proceed with deletion
    const adminClient = createAdminClient()

    // Get user profile for email notification
    const { data: userProfile } = await adminClient
      .from('users')
      .select('full_name, email')
      .eq('id', user.id)
      .single()
    
    const userEmail = user.email || userProfile?.email
    const userName = userProfile?.full_name

    // Delete in order (respecting foreign key constraints):
    
    // 1. Delete attachments (files need to be deleted from storage too)
    const { data: attachments } = await adminClient
      .from('attachments')
      .select('file_url')
      .eq('user_id', user.id)
    
    if (attachments?.length) {
      const filePaths = attachments
        .map(a => {
          const url = a.file_url
          const match = url?.match(/\/attachments\/(.+)/)
          return match ? match[1] : null
        })
        .filter(Boolean) as string[]
      
      if (filePaths.length) {
        await adminClient.storage.from('attachments').remove(filePaths)
      }
    }
    
    await adminClient
      .from('attachments')
      .delete()
      .eq('user_id', user.id)

    // 2. Delete payment allocations (via payments)
    const { data: payments } = await adminClient
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
    
    if (payments?.length) {
      const paymentIds = payments.map(p => p.id)
      await adminClient
        .from('payment_allocations')
        .delete()
        .in('payment_id', paymentIds)
    }

    // 3. Delete payments
    await adminClient
      .from('payments')
      .delete()
      .eq('user_id', user.id)

    // 4. Delete receipt snapshots
    await adminClient
      .from('receipt_snapshots')
      .delete()
      .eq('user_id', user.id)

    // 5. Delete invoice line items (via invoices)
    const { data: invoices } = await adminClient
      .from('invoices')
      .select('id')
      .eq('user_id', user.id)
    
    if (invoices?.length) {
      const invoiceIds = invoices.map(i => i.id)
      await adminClient
        .from('invoice_line_items')
        .delete()
        .in('invoice_id', invoiceIds)
    }

    // 6. Delete invoices
    await adminClient
      .from('invoices')
      .delete()
      .eq('user_id', user.id)

    // 7. Delete notes
    await adminClient
      .from('notes')
      .delete()
      .eq('user_id', user.id)

    // 8. Delete customers
    await adminClient
      .from('customers')
      .delete()
      .eq('user_id', user.id)

    // 9. Delete password reset tokens (table may not be in types yet)
    await (adminClient as any)
      .from('password_reset_tokens')
      .delete()
      .eq('user_id', user.id)

    // 10. Delete email verification tokens (table may not be in types yet)
    await (adminClient as any)
      .from('email_verification_tokens')
      .delete()
      .eq('user_id', user.id)

    // 11. Delete user's logo from storage
    const { data: profile } = await adminClient
      .from('users')
      .select('logo_url, avatar_url')
      .eq('id', user.id)
      .single()
    
    if (profile?.logo_url) {
      const logoMatch = profile.logo_url.match(/\/logos\/(.+)/)
      if (logoMatch) {
        await adminClient.storage.from('logos').remove([logoMatch[1]])
      }
    }
    
    if (profile?.avatar_url) {
      const avatarMatch = profile.avatar_url.match(/\/avatars\/(.+)/)
      if (avatarMatch) {
        await adminClient.storage.from('avatars').remove([avatarMatch[1]])
      }
    }

    // 12. Delete user profile
    await adminClient
      .from('users')
      .delete()
      .eq('id', user.id)

    // 13. Delete auth user (requires admin API)
    await adminClient.auth.admin.deleteUser(user.id)

    // 14. Send account deletion confirmation email
    if (userEmail && isEmailConfigured()) {
      sendAccountDeletedEmail({
        email: userEmail,
        name: userName || undefined,
      }).catch(err => console.error('Failed to send account deletion email:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Account and all associated data permanently deleted',
      deleted_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Account deletion failed. Please contact support.' },
      { status: 500 }
    )
  }
}
