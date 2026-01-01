import { test, expect } from '@playwright/test'

/**
 * Marketing Pages E2E Tests
 * Tests public-facing marketing and information pages
 */

test.describe('Marketing Pages', () => {
  test.describe('Homepage', () => {
    test('displays hero section', async ({ page }) => {
      await page.goto('/')
      
      // Check for main heading
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      
      // Check for CTA buttons
      await expect(page.getByRole('link', { name: /get started|sign up|start free/i })).toBeVisible()
    })

    test('has navigation links', async ({ page }) => {
      await page.goto('/')
      
      // Check nav elements exist
      await expect(page.getByRole('navigation')).toBeVisible()
    })

    test('navigates to login from header', async ({ page }) => {
      await page.goto('/')
      
      await page.getByRole('link', { name: /log in|sign in/i }).first().click()
      await expect(page).toHaveURL(/login/)
    })
  })

  test.describe('Pricing Page', () => {
    test('displays pricing plans', async ({ page }) => {
      await page.goto('/pricing')
      
      // Check for pricing-related content
      await expect(page.locator('text=/free|starter|pro|business|pricing/i').first()).toBeVisible()
    })
  })

  test.describe('About Page', () => {
    test('displays about content', async ({ page }) => {
      await page.goto('/about')
      
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })
  })

  test.describe('Help/Documentation', () => {
    test('displays help center', async ({ page }) => {
      await page.goto('/help')
      
      // Check for help content
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('has searchable content', async ({ page }) => {
      await page.goto('/help')
      
      // Check for search functionality
      const searchInput = page.getByPlaceholder(/search/i)
      if (await searchInput.isVisible()) {
        await searchInput.fill('invoice')
        // Search should work without errors
      }
    })
  })

  test.describe('Legal Pages', () => {
    test('displays privacy policy', async ({ page }) => {
      await page.goto('/privacy')
      
      // Use first() to handle multiple matching headings
      await expect(page.getByRole('heading', { name: /privacy/i }).first()).toBeVisible()
    })

    test('displays terms of service', async ({ page }) => {
      await page.goto('/terms')
      
      // Use first() to handle multiple matching headings
      await expect(page.getByRole('heading', { name: /terms/i }).first()).toBeVisible()
    })
  })

  test.describe('Contact Page', () => {
    test('displays contact form', async ({ page }) => {
      await page.goto('/contact')
      
      // Check for contact form elements
      await expect(page.getByLabel(/name|email|message/i).first()).toBeVisible()
    })
  })
})

test.describe('SEO & Meta', () => {
  test('homepage has proper meta tags', async ({ page }) => {
    await page.goto('/')
    
    // Check title
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(10)
    
    // Check meta description
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content')
    expect(metaDescription).toBeTruthy()
  })

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)
  })

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml')
    expect(response?.status()).toBe(200)
  })
})

test.describe('Responsive Design', () => {
  test('homepage works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Should not have horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // Allow 1px tolerance
  })

  test('navigation is accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Should have mobile menu toggle or header accessible
    const header = page.locator('header')
    const nav = page.getByRole('navigation')
    
    // Either nav or header should be visible
    const hasNav = await nav.isVisible().catch(() => false)
    const hasHeader = await header.isVisible().catch(() => false)
    
    expect(hasNav || hasHeader).toBeTruthy()
  })
})
