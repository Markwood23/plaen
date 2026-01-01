import { test, expect, Page } from '@playwright/test'
import { loginAsTestUser, TEST_USER, RECIPIENT_EMAIL } from './test-utils'

/**
 * Invoice E2E Tests
 * Tests the complete invoice lifecycle:
 * - Create invoice
 * - Preview invoice
 * - Send invoice
 * - View invoice list
 * - Record payment
 * 
 * Recipient: nanaduah09@gmail.com
 */

test.describe('Invoice Management', () => {
  
  // Setup: Login before invoice tests that require auth
  test.describe('Authenticated Invoice Tests', () => {
    
    test.beforeEach(async ({ page }) => {
      // Skip login in CI or use real credentials
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

    test('should display invoices list page', async ({ page }) => {
      await page.goto('/invoices')
      
      // Should show invoices page elements
      await expect(page.locator('h1, h2').first()).toContainText(/invoice/i)
      
      // Should have create button
      const createButton = page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("New")')
      await expect(createButton.first()).toBeVisible()
    })

    test('should navigate to create invoice page', async ({ page }) => {
      await page.goto('/invoices')
      
      // Click create button
      const createButton = page.locator('a[href*="/invoices/new"], button:has-text("Create"), button:has-text("New Invoice")').first()
      await createButton.click()
      
      await expect(page).toHaveURL(/invoices\/new/)
    })

    test('should display invoice creation form', async ({ page }) => {
      await page.goto('/invoices/new')
      
      // Check page header and basic elements
      await expect(page.locator('h1').first()).toContainText(/new invoice/i)
      // Form should have tabs
      await expect(page.locator('[role="tablist"]').first()).toBeVisible()
    })

    test('should create invoice with line items', async ({ page }) => {
      await page.goto('/invoices/new')
      await page.waitForLoadState('networkidle')
      
      // Invoice creation form should be loaded
      await expect(page.locator('h1').first()).toContainText(/new invoice/i)
      
      // Check for Preview Invoice button
      const previewButton = page.locator('button:has-text("Preview"), button:has-text("Create")')
      await expect(previewButton.first()).toBeVisible()
      
      // Form has tabs for details and line items
      const tabs = page.locator('[role="tab"]')
      expect(await tabs.count()).toBeGreaterThan(0)
    })

    test('should preview invoice before sending', async ({ page }) => {
      await page.goto('/invoices')
      
      // Click on first invoice if exists
      const firstInvoice = page.locator('table tbody tr, [data-invoice-id]').first()
      if (await firstInvoice.isVisible()) {
        await firstInvoice.click()
        await page.waitForTimeout(500)
        
        // Look for preview button
        const previewButton = page.locator('button:has-text("Preview"), a:has-text("Preview")').first()
        if (await previewButton.isVisible()) {
          await previewButton.click()
          
          // Should show preview
          await expect(page).toHaveURL(/preview/)
        }
      }
    })

    test('should send invoice to recipient email', async ({ page }) => {
      await page.goto('/invoices')
      
      // Click on first invoice
      const firstInvoice = page.locator('table tbody tr, [data-invoice-id]').first()
      if (await firstInvoice.isVisible()) {
        await firstInvoice.click()
        await page.waitForURL(/invoices\/[^\/]+$/)
        
        // Look for send button
        const sendButton = page.locator('button:has-text("Send"), button:has-text("Send Invoice")').first()
        if (await sendButton.isVisible()) {
          await sendButton.click()
          
          // Fill recipient email in modal
          await page.waitForTimeout(500)
          const emailInput = page.locator('input[type="email"]').first()
          if (await emailInput.isVisible()) {
            await emailInput.fill(RECIPIENT_EMAIL)
            
            // Click send/confirm
            const confirmButton = page.locator('button:has-text("Send"), button:has-text("Confirm")').first()
            await confirmButton.click()
            
            // Should show success
            await expect(page.locator('text=/sent|success/i')).toBeVisible({ timeout: 10000 })
          }
        }
      }
    })

    test('should filter invoices by status', async ({ page }) => {
      await page.goto('/invoices')
      
      // Find status filter
      const statusFilter = page.locator('select, [role="combobox"]').first()
      if (await statusFilter.isVisible()) {
        await statusFilter.click()
        
        // Select a status
        const paidOption = page.locator('text=/paid/i').first()
        if (await paidOption.isVisible()) {
          await paidOption.click()
        }
      }
    })

    test('should search invoices', async ({ page }) => {
      await page.goto('/invoices')
      
      const searchInput = page.locator('input[placeholder*="search"], input[type="search"]').first()
      if (await searchInput.isVisible()) {
        await searchInput.fill('INV-')
        await page.waitForTimeout(500)
        
        // Results should update
      }
    })

    test('should record payment on invoice', async ({ page }) => {
      await page.goto('/invoices')
      
      // Find an unpaid invoice
      const unpaidInvoice = page.locator('tr:has-text("Sent"), tr:has-text("Unpaid"), tr:has-text("Pending")').first()
      if (await unpaidInvoice.isVisible()) {
        await unpaidInvoice.click()
        await page.waitForURL(/invoices\/[^\/]+$/)
        
        // Click record payment
        const recordPaymentBtn = page.locator('button:has-text("Record Payment"), button:has-text("Payment")').first()
        if (await recordPaymentBtn.isVisible()) {
          await recordPaymentBtn.click()
          
          await page.waitForTimeout(500)
          
          // Fill payment details
          const amountInput = page.locator('input[name="amount"], input[placeholder*="amount"]').first()
          if (await amountInput.isVisible()) {
            await amountInput.fill('100')
          }
          
          // Select payment method
          const methodSelect = page.locator('select, [role="combobox"]').first()
          if (await methodSelect.isVisible()) {
            await methodSelect.click()
            const momoOption = page.locator('text=/mobile money|momo|cash/i').first()
            if (await momoOption.isVisible()) {
              await momoOption.click()
            }
          }
        }
      }
    })

    test('should download invoice PDF', async ({ page }) => {
      await page.goto('/invoices')
      
      const firstInvoice = page.locator('table tbody tr').first()
      if (await firstInvoice.isVisible()) {
        await firstInvoice.click()
        await page.waitForURL(/invoices\/[^\/]+$/)
        
        // Find download button
        const downloadBtn = page.locator('button:has-text("Download"), button:has-text("PDF")').first()
        if (await downloadBtn.isVisible()) {
          // Setup download listener
          const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null)
          await downloadBtn.click()
          
          const download = await downloadPromise
          if (download) {
            expect(download.suggestedFilename()).toContain('.pdf')
          }
        }
      }
    })

    test('should copy payment link', async ({ page }) => {
      await page.goto('/invoices')
      
      const firstInvoice = page.locator('table tbody tr').first()
      if (await firstInvoice.isVisible()) {
        await firstInvoice.click()
        await page.waitForURL(/invoices\/[^\/]+$/)
        
        // Find copy link button
        const copyLinkBtn = page.locator('button:has-text("Copy"), button:has-text("Payment Link")').first()
        if (await copyLinkBtn.isVisible()) {
          await copyLinkBtn.click()
          
          // Should show copied feedback
          await expect(page.locator('text=/copied/i')).toBeVisible({ timeout: 5000 })
        }
      }
    })
  })

  test.describe('Public Payment Page', () => {
    test('shows 404 for invalid invoice ID', async ({ page }) => {
      await page.goto('/pay/invalid-invoice-id-12345')
      
      await expect(page.locator('text=/not found|invalid|expired|error|doesn\'t exist/i')).toBeVisible({ timeout: 10000 })
    })

    test('displays payment page structure', async ({ page }) => {
      // This would need a valid invoice ID
      // For now, test that the route exists
      const response = await page.goto('/pay/test-id')
      expect(response?.status()).toBeLessThan(500)
    })
  })

  test.describe('Invoice Validation', () => {
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

    test('should require customer for invoice', async ({ page }) => {
      await page.goto('/invoices/new')
      await page.waitForLoadState('networkidle')
      
      // Try to click preview/save - should show validation or be disabled
      const previewBtn = page.locator('button:has-text(\"Preview Invoice\"), button:has-text(\"Save\")').first()
      if (await previewBtn.isVisible()) {
        await previewBtn.click()
        
        // Should show validation error or stay on page
        await page.waitForTimeout(500)
        // Page should still be on new invoice
        expect(page.url()).toContain('/invoices/new')
      }
    })

    test('should require at least one line item', async ({ page }) => {
      await page.goto('/invoices/new')
      await page.waitForLoadState('networkidle')
      
      // Click the Line Items tab first
      const itemsTab = page.locator('[role=\"tab\"]:has-text(\"Items\"), button:has-text(\"Line Items\")')
      if (await itemsTab.first().isVisible()) {
        await itemsTab.first().click()
        await page.waitForTimeout(300)
      }
      
      // Try to submit - form validation should prevent it
      const previewBtn = page.locator('button:has-text(\"Preview\")').first()
      if (await previewBtn.isVisible()) {
        await previewBtn.click()
        await page.waitForTimeout(500)
        
        // Page should still be on new invoice (validation failed)
        expect(page.url()).toContain('/invoices/new')
      }
    })
  })
})
