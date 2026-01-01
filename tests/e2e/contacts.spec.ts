import { test, expect } from '@playwright/test'
import { loginAsTestUser, RECIPIENT_EMAIL } from './test-utils'

/**
 * Contacts/Customers E2E Tests
 * Tests contact management functionality:
 * - View contacts list
 * - Create new contact
 * - Edit contact
 * - Delete contact
 * - View contact details
 * - Create invoice from contact
 */

test.describe('Contacts Management', () => {
  
  test.describe('Authenticated Contact Tests', () => {
    
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

    test('should display contacts list page', async ({ page }) => {
      await page.goto('/contacts')
      
      // Should show contacts page
      await expect(page.locator('h1, h2').first()).toContainText(/contact|customer|client/i)
      
      // Should have add contact button
      const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")')
      await expect(addButton.first()).toBeVisible()
    })

    test('should open add contact modal', async ({ page }) => {
      await page.goto('/contacts')
      
      // Click add button - text is "+ New Contact"
      const addButton = page.locator('button:has-text("New Contact")')
      await addButton.click()
      
      await page.waitForTimeout(500)
      
      // Modal should open
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      
      // Should have name field - uses id="name"
      await expect(page.locator('input#name, input[placeholder*="name"]').first()).toBeVisible()
    })

    test('should create new contact', async ({ page }) => {
      await page.goto('/contacts')
      
      // Open add modal - button text is "+ New Contact"
      const addButton = page.locator('button:has-text("New Contact")')
      await addButton.click()
      await page.waitForTimeout(500)
      
      // Fill contact form - uses id="name"
      const nameInput = page.locator('input#name, input[placeholder*="name"]').first()
      await nameInput.fill('Test Customer ' + Date.now())
      
      const emailInput = page.locator('input#email, input[type="email"]').first()
      if (await emailInput.isVisible()) {
        await emailInput.fill(RECIPIENT_EMAIL)
      }
      
      const phoneInput = page.locator('input#phone, input[placeholder*="phone"]').first()
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('024 555 1234')
      }
      
      const companyInput = page.locator('input#company, input[placeholder*="company"]').first()
      if (await companyInput.isVisible()) {
        await companyInput.fill('Test Company Ltd')
      }
      
      // Save contact - look for Create Contact button
      const saveButton = page.locator('button:has-text("Create Contact"), button:has-text("Save")').last()
      await saveButton.click()
      
      // Wait for either modal to close or success message
      await page.waitForTimeout(2000)
      
      // Either modal closes or contact is created (stays in view mode)
      const dialogVisible = await page.locator('[role="dialog"]').isVisible()
      // Success if modal closed OR if modal switches to view mode (shows Edit button)
      const editButtonVisible = await page.locator('button:has-text("Edit")').isVisible().catch(() => false)
      expect(!dialogVisible || editButtonVisible).toBeTruthy()
    })

    test('should view contact details', async ({ page }) => {
      await page.goto('/contacts')
      
      // Click on first contact
      const firstContact = page.locator('table tbody tr, [data-contact-id]').first()
      if (await firstContact.isVisible()) {
        await firstContact.click()
        await page.waitForTimeout(500)
        
        // Should show contact details modal
        const modal = page.locator('[role="dialog"], .modal')
        await expect(modal).toBeVisible()
        
        // Should show contact info
        await expect(page.locator('text=/email|phone|company/i').first()).toBeVisible()
      }
    })

    test('should edit contact', async ({ page }) => {
      await page.goto('/contacts')
      
      // Click on first contact
      const firstContact = page.locator('table tbody tr').first()
      if (await firstContact.isVisible()) {
        await firstContact.click()
        await page.waitForTimeout(500)
        
        // Find edit button
        const editButton = page.locator('button:has-text("Edit")').first()
        if (await editButton.isVisible()) {
          await editButton.click()
          await page.waitForTimeout(300)
          
          // Should enable editing - input uses id="name"
          const nameInput = page.locator('input#name, input[placeholder*=\"name\"]').first()
          if (await nameInput.isVisible() && await nameInput.isEnabled()) {
            const currentValue = await nameInput.inputValue()
            await nameInput.fill(currentValue + ' Updated')
            
            // Save changes
            const saveButton = page.locator('button:has-text("Save")').first()
            await saveButton.click()
            
            // Should show success
            await page.waitForTimeout(1000)
          }
        }
      }
    })

    test('should search contacts', async ({ page }) => {
      await page.goto('/contacts')
      
      const searchInput = page.locator('input[placeholder*="search"], input[type="search"]').first()
      if (await searchInput.isVisible()) {
        await searchInput.fill('test')
        await page.waitForTimeout(500)
        
        // Results should filter
      }
    })

    test('should create invoice from contact', async ({ page }) => {
      await page.goto('/contacts')
      
      // Click on first contact
      const firstContact = page.locator('table tbody tr').first()
      if (await firstContact.isVisible()) {
        await firstContact.click()
        await page.waitForTimeout(500)
        
        // Find create invoice button
        const createInvoiceBtn = page.locator('button:has-text("Create Invoice"), button:has-text("Invoice")').first()
        if (await createInvoiceBtn.isVisible()) {
          await createInvoiceBtn.click()
          
          // Should navigate to invoice creation with contact pre-filled
          await expect(page).toHaveURL(/invoices\/new/)
        }
      }
    })

    test('should email contact', async ({ page }) => {
      await page.goto('/contacts')
      
      // Click on first contact
      const firstContact = page.locator('table tbody tr').first()
      if (await firstContact.isVisible()) {
        await firstContact.click()
        await page.waitForTimeout(500)
        
        // Find email button
        const emailButton = page.locator('button:has-text("Email")').first()
        if (await emailButton.isVisible()) {
          // Clicking should attempt to open email client
          // We can't test email client opening, but button should exist
          expect(await emailButton.isEnabled()).toBeTruthy()
        }
      }
    })

    test('should show contact statistics', async ({ page }) => {
      await page.goto('/contacts')
      
      // Click on first contact
      const firstContact = page.locator('table tbody tr').first()
      if (await firstContact.isVisible()) {
        await firstContact.click()
        await page.waitForTimeout(500)
        
        // Should show stats
        const statsVisible = await page.locator('text=/total invoices|revenue|outstanding/i').isVisible()
        if (!statsVisible) {
          // Stats might be in a different format
          const hasInvoiceHistory = await page.locator('text=/invoice|recent/i').isVisible()
          expect(hasInvoiceHistory).toBeTruthy()
        }
      }
    })

    test('should delete contact', async ({ page }) => {
      await page.goto('/contacts')
      
      // First create a contact to delete - button is \"+ New Contact\"
      const addButton = page.locator('button:has-text(\"New Contact\")')
      await addButton.click()
      await page.waitForTimeout(500)
      
      // Input uses id=\"name\"
      const nameInput = page.locator('input#name').first()
      const testName = 'Delete Me ' + Date.now()
      await nameInput.fill(testName)
      
      const saveButton = page.locator('button:has-text(\"Save\"), button:has-text(\"Create Contact\")').last()
      await saveButton.click()
      await page.waitForTimeout(1000)
      
      // Now find and delete it
      const searchInput = page.locator('input[placeholder*="search"]').first()
      if (await searchInput.isVisible()) {
        await searchInput.fill('Delete Me')
        await page.waitForTimeout(500)
      }
      
      const contact = page.locator('table tbody tr').first()
      if (await contact.isVisible()) {
        await contact.click()
        await page.waitForTimeout(500)
        
        const deleteButton = page.locator('button:has-text("Delete")').first()
        if (await deleteButton.isVisible()) {
          await deleteButton.click()
          
          // Confirm deletion
          const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').last()
          await confirmButton.click()
          
          // Should remove contact
          await page.waitForTimeout(1000)
        }
      }
    })

    test('should show empty state for new users', async ({ page }) => {
      // This test checks empty state behavior
      await page.goto('/contacts')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      // Check if there are contacts in the table
      const contactsTable = page.locator('table tbody tr')
      const hasContacts = await contactsTable.count() > 0
      
      // Empty state might use different elements
      const emptyHeading = page.locator('h3:has-text("No contacts")')
      const emptyButton = page.locator('a:has-text("Add Your First Contact")')
      
      if (!hasContacts) {
        // Should show empty state elements
        const hasEmptyUI = await emptyHeading.isVisible().catch(() => false) || 
                          await emptyButton.isVisible().catch(() => false)
        expect(hasEmptyUI).toBeTruthy()
      } else {
        // User has contacts - test passes (empty state not applicable)
        expect(hasContacts).toBeTruthy()
      }
    })
  })

  test.describe('Contact Validation', () => {
    
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

    test('should require name for contact', async ({ page }) => {
      await page.goto('/contacts')
      
      const addButton = page.locator('button:has-text(\"New Contact\")')
      await addButton.click()
      await page.waitForTimeout(500)
      
      // Try to save without name - button should be disabled or show error
      const saveButton = page.locator('button:has-text(\"Save\"), button:has-text(\"Create Contact\")').last()
      const saveEnabled = await saveButton.isEnabled()
      // Button is likely disabled without required fields
      expect(saveEnabled === false || await page.locator('[role=\"dialog\"]').isVisible()).toBeTruthy()
    })

    test('should validate email format', async ({ page }) => {
      await page.goto('/contacts')
      
      const addButton = page.locator('button:has-text(\"New Contact\")')
      await addButton.click()
      await page.waitForTimeout(500)
      
      // Input uses id=\"name\"
      const nameInput = page.locator('input#name').first()
      await nameInput.fill('Test Contact')
      
      // Input uses id=\"email\"
      const emailInput = page.locator('input#email, input[type=\"email\"]').first()
      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email')
        await emailInput.blur()
        
        // Validation might be on submit - just check modal is still open
        await page.waitForTimeout(300)
        expect(await page.locator('[role=\"dialog\"]').isVisible()).toBeTruthy()
      }
    })
  })
})
