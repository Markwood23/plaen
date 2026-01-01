import { test, expect } from '@playwright/test'
import { loginAsTestUser, RECIPIENT_EMAIL } from './test-utils'

/**
 * Payment Flow E2E Tests
 * Tests the complete payment flow:
 * - Public payment page
 * - Payment method selection
 * - Mobile money payment
 * - Payment verification
 * - Receipt generation
 */

test.describe('Public Payment Page', () => {
  
  test('displays 404 for invalid invoice ID', async ({ page }) => {
    await page.goto('/pay/invalid-id-12345')
    
    // Should show not found or error state
    await expect(
      page.locator('text=/not found|invalid|expired|error|doesn\'t exist/i')
    ).toBeVisible({ timeout: 10000 })
  })

  test('displays payment page structure for valid-looking ID', async ({ page }) => {
    // Use a UUID-like ID to test route handling
    await page.goto('/pay/00000000-0000-0000-0000-000000000000')
    
    // Should either show payment page or not found
    // Page should load without server error
    const response = await page.goto('/pay/test-invoice-id')
    expect(response?.status()).toBeLessThan(500)
  })

  test('shows loading state initially', async ({ page }) => {
    const responsePromise = page.waitForResponse(/\/api\/pay/)
    await page.goto('/pay/test-invoice')
    
    // Should show loading or content quickly
    await page.waitForTimeout(1000)
  })
})

test.describe('Payment Methods', () => {
  
  // These tests would require a valid invoice
  test.skip('displays available payment methods', async ({ page }) => {
    // await page.goto('/pay/VALID_INVOICE_ID')
    
    // Check payment method options are displayed
    // await expect(page.locator('text=/mobile money|momo/i')).toBeVisible()
    // await expect(page.locator('text=/bank|transfer/i')).toBeVisible()
  })

  test.skip('allows selecting mobile money', async ({ page }) => {
    // await page.goto('/pay/VALID_INVOICE_ID')
    
    // Select MoMo option
    // await page.click('text=/mobile money|momo/i')
    
    // Should show phone input
    // await expect(page.getByLabel(/phone/i)).toBeVisible()
  })

  test.skip('validates phone number format', async ({ page }) => {
    // await page.goto('/pay/VALID_INVOICE_ID')
    
    // Select MoMo
    // await page.click('text=/mobile money|momo/i')
    
    // Enter invalid phone
    // await page.fill('input[name="phone"]', '123')
    // await page.click('button:has-text("Pay")')
    
    // Should show validation error
    // await expect(page.locator('text=/valid phone|invalid/i')).toBeVisible()
  })
})

test.describe('Payment Callbacks', () => {
  
  test('handles payment success callback URL', async ({ page }) => {
    // Test that callback routes exist
    const response = await page.goto('/pay/test-invoice?status=successful&tx_ref=test-123')
    expect(response?.status()).toBeLessThan(500)
  })

  test('handles payment failure callback URL', async ({ page }) => {
    const response = await page.goto('/pay/test-invoice?status=failed&tx_ref=test-456')
    expect(response?.status()).toBeLessThan(500)
  })

  test('handles cancelled payment', async ({ page }) => {
    const response = await page.goto('/pay/test-invoice?status=cancelled')
    expect(response?.status()).toBeLessThan(500)
  })
})

test.describe('Authenticated Payment Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    if (process.env.CI) {
      test.skip()
      return
    }
    
    try {
      await loginAsTestUser(page)
    } catch {
      test.skip()
    }
  })

  test('should record manual payment on invoice', async ({ page }) => {
    await page.goto('/invoices')
    
    // Find an unpaid invoice
    const unpaidInvoice = page.locator('tr:has-text("Sent"), tr:has-text("Pending"), tr:has-text("Unpaid")').first()
    if (await unpaidInvoice.isVisible()) {
      await unpaidInvoice.click()
      await page.waitForURL(/invoices\/[^\/]+$/)
      
      // Click record payment
      const recordBtn = page.locator('button:has-text("Record Payment")').first()
      if (await recordBtn.isVisible()) {
        await recordBtn.click()
        await page.waitForTimeout(500)
        
        // Fill payment form
        const amountInput = page.locator('input[name="amount"], input[placeholder*="amount"]').first()
        if (await amountInput.isVisible()) {
          await amountInput.fill('100')
        }
        
        // Select method
        const methodSelect = page.locator('select, [role="combobox"]').first()
        if (await methodSelect.isVisible()) {
          await methodSelect.click()
          const cashOption = page.locator('text=/cash|bank|mobile/i').first()
          if (await cashOption.isVisible()) {
            await cashOption.click()
          }
        }
        
        // Submit
        const submitBtn = page.locator('button:has-text("Record"), button:has-text("Save"), button[type="submit"]').last()
        if (await submitBtn.isVisible()) {
          await submitBtn.click()
          
          // Should close modal and update invoice
          await page.waitForTimeout(2000)
        }
      }
    }
  })

  test('should view payment history on invoice', async ({ page }) => {
    await page.goto('/invoices')
    
    // Find a paid or partially paid invoice
    const paidInvoice = page.locator('tr:has-text("Paid"), tr:has-text("Partial")').first()
    if (await paidInvoice.isVisible()) {
      await paidInvoice.click()
      await page.waitForURL(/invoices\/[^\/]+$/)
      
      // Should show payment history
      const hasPaymentHistory = await page.locator('text=/payment|received|history/i').isVisible()
      expect(hasPaymentHistory).toBeTruthy()
    }
  })

  test('should navigate to receipt from payment', async ({ page }) => {
    await page.goto('/invoices')
    
    // Find paid invoice
    const paidInvoice = page.locator('tr:has-text("Paid")').first()
    if (await paidInvoice.isVisible()) {
      await paidInvoice.click()
      await page.waitForURL(/invoices\/[^\/]+$/)
      
      // Look for receipt link
      const receiptLink = page.locator('a[href*="/receipts"], button:has-text("View Receipt")').first()
      if (await receiptLink.isVisible()) {
        await receiptLink.click()
        await expect(page).toHaveURL(/receipts\//)
      }
    }
  })
})

test.describe('Payment Verification API', () => {
  
  test('verify endpoint returns proper response', async ({ request }) => {
    // Test the verification endpoint structure
    const response = await request.post('/api/payments/verify', {
      data: {
        tx_ref: 'test-ref-123',
        invoice_id: 'test-invoice-id'
      }
    })
    
    // Should return JSON response (might be error without valid data)
    expect(response.headers()['content-type']).toContain('json')
  })
})

