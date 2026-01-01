import { Page } from '@playwright/test'

/**
 * Shared test utilities for E2E tests
 * 
 * Test accounts:
 * - Primary user: nanaduah.09@gmail.com
 * - Invoice recipient: nanaduah09@gmail.com
 */

// Test constants
export const TEST_USER = {
  email: 'nanaduah.09@gmail.com',
  password: 'Cappello23',
  firstName: 'Nana',
  lastName: 'Duah',
  phone: '024 123 4567',
  businessName: 'Duah Enterprises',
}

export const RECIPIENT_EMAIL = 'nanaduah09@gmail.com'

// Helper to generate unique test email
export function generateTestEmail(): string {
  return `test+${Date.now()}@example.com`
}

// Helper function to login
export async function loginAsTestUser(page: Page, email = TEST_USER.email, password = TEST_USER.password) {
  await page.goto('/login')
  await page.locator('input[type="email"], input[name="email"]').fill(email)
  await page.locator('input[type="password"], input[name="password"]').fill(password)
  await page.locator('button[type="submit"]').click()
  
  // Wait for redirect to dashboard or workspace (with longer timeout)
  await page.waitForURL(/dashboard|invoices|notes/, { timeout: 45000 })
}

// Helper to check if user is logged in
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    return !page.url().includes('/login')
  } catch {
    return false
  }
}
