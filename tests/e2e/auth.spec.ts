import { test, expect } from '@playwright/test'

/**
 * Authentication Flow E2E Tests
 * Tests signup, login, logout, and password reset flows
 */

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test('displays login form', async ({ page }) => {
      await page.goto('/login')
      
      // Check page title/heading
      await expect(page.getByRole('heading', { name: /sign in|log in|welcome/i })).toBeVisible()
      
      // Check form elements
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible()
    })

    test('shows validation errors for empty form', async ({ page }) => {
      await page.goto('/login')
      
      // Submit empty form
      await page.getByRole('button', { name: /sign in|log in/i }).click()
      
      // Check for validation message
      await expect(page.locator('text=/required|enter.*email|invalid/i')).toBeVisible()
    })

    test('shows error for invalid credentials', async ({ page }) => {
      await page.goto('/login')
      
      await page.getByLabel(/email/i).fill('nonexistent@example.com')
      await page.getByLabel(/password/i).fill('wrongpassword123')
      await page.getByRole('button', { name: /sign in|log in/i }).click()
      
      // Should show error (not redirect)
      await expect(page.locator('text=/invalid|incorrect|not found/i')).toBeVisible({ timeout: 10000 })
    })

    test('has link to signup page', async ({ page }) => {
      await page.goto('/login')
      
      const signupLink = page.getByRole('link', { name: /sign up|create.*account|register/i })
      await expect(signupLink).toBeVisible()
      
      await signupLink.click()
      await expect(page).toHaveURL(/signup/)
    })

    test('has link to forgot password', async ({ page }) => {
      await page.goto('/login')
      
      const forgotLink = page.getByRole('link', { name: /forgot|reset.*password/i })
      await expect(forgotLink).toBeVisible()
      
      await forgotLink.click()
      await expect(page).toHaveURL(/forgot-password/)
    })
  })

  test.describe('Signup Page', () => {
    test('displays signup form', async ({ page }) => {
      await page.goto('/signup')
      
      await expect(page.getByRole('heading', { name: /sign up|create.*account|register|get started/i })).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i).first()).toBeVisible()
      await expect(page.getByRole('button', { name: /sign up|create|register|get started/i })).toBeVisible()
    })

    test('validates email format', async ({ page }) => {
      await page.goto('/signup')
      
      await page.getByLabel(/email/i).fill('invalid-email')
      await page.getByLabel(/password/i).first().fill('TestPass123!')
      await page.getByRole('button', { name: /sign up|create|register|get started/i }).click()
      
      await expect(page.locator('text=/invalid.*email|valid.*email/i')).toBeVisible()
    })

    test('has link to login page', async ({ page }) => {
      await page.goto('/signup')
      
      const loginLink = page.getByRole('link', { name: /sign in|log in|already.*account/i })
      await expect(loginLink).toBeVisible()
      
      await loginLink.click()
      await expect(page).toHaveURL(/login/)
    })
  })

  test.describe('Forgot Password Page', () => {
    test('displays password reset form', async ({ page }) => {
      await page.goto('/forgot-password')
      
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /reset|send|submit/i })).toBeVisible()
    })

    test('shows success message after submission', async ({ page }) => {
      await page.goto('/forgot-password')
      
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByRole('button', { name: /reset|send|submit/i }).click()
      
      // Should show success message (even if email doesn't exist for security)
      await expect(page.locator('text=/sent|check.*email|instructions/i')).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('Protected Routes', () => {
    test('redirects unauthenticated users from dashboard', async ({ page }) => {
      await page.goto('/dashboard')
      
      // Should redirect to login
      await expect(page).toHaveURL(/login/)
    })

    test('redirects unauthenticated users from invoices', async ({ page }) => {
      await page.goto('/invoices')
      
      await expect(page).toHaveURL(/login/)
    })

    test('redirects unauthenticated users from settings', async ({ page }) => {
      await page.goto('/settings')
      
      await expect(page).toHaveURL(/login/)
    })
  })
})
