import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendAccountDeletedEmail, isEmailConfigured } from '@/lib/email/mailjet'

/**
 * DELETE /api/settings/account
 * 
 * GDPR-compliant account deletion endpoint.
 * Permanently deletes user account and all associated data.
 * 
 * Required body: { confirm: true }
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    if (!body.confirm) {
      return NextResponse.json(
        { error: 'Must confirm deletion by setting confirm: true' },
        { status: 400 }
      )
    }

    // Use admin client for deletion operations
    const adminClient = createAdminClient()
    
    // Get user profile for email notification before deletion
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
      // Extract file paths from URLs and delete from storage
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

    // 7. Delete notes (data_queries table may not exist, so skip cascade)
    // If data_queries exists with FK cascade, it will be deleted automatically
    await adminClient
      .from('notes')
      .delete()
      .eq('user_id', user.id)

    // 8. Delete customers
    await adminClient
      .from('customers')
      .delete()
      .eq('user_id', user.id)

    // 10. Delete user's logo from storage
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

    // 11. Delete user profile
    await adminClient
      .from('users')
      .delete()
      .eq('id', user.id)

    // 12. Delete auth user (requires admin API)
    await adminClient.auth.admin.deleteUser(user.id)

    // 13. Send account deletion confirmation email
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
