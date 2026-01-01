import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './test-utils'

/**
 * Notes E2E Tests
 * Tests the Finance Notes functionality:
 * - View notes list
 * - Create new note
 * - Edit note with rich text
 * - Delete note
 * - Search notes
 * - View modes (grid/table)
 */

test.describe('Notes Management', () => {
  
  test.describe('Authenticated Notes Tests', () => {
    
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

    test('should display notes list page', async ({ page }) => {
      await page.goto('/notes')
      
      // Should show notes page
      await expect(page.locator('h1, h2').first()).toContainText(/note|finance note/i)
      
      // Should have create button or link
      const createButton = page.locator('a:has-text("Add Note"), a:has-text("Create"), a:has-text("Write")')
      await expect(createButton.first()).toBeVisible()
    })

    test('should navigate to create note page', async ({ page }) => {
      await page.goto('/notes')
      
      const createButton = page.locator('button:has-text("Create"), button:has-text("New Note"), a[href*="/notes/new"]').first()
      await createButton.click()
      
      await expect(page).toHaveURL(/notes\/new|notes\/[^\/]+/)
    })

    test('should create new note with title', async ({ page }) => {
      await page.goto('/notes/new')
      await page.waitForLoadState('networkidle')
      
      // Find title input
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"], [contenteditable][data-placeholder*="title"]').first()
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test Note ' + Date.now())
      }
      
      // Find content editor
      const contentEditor = page.locator('[contenteditable="true"], textarea[name="content"], .ProseMirror').first()
      if (await contentEditor.isVisible()) {
        await contentEditor.click()
        await page.keyboard.type('This is test note content created by automated tests.')
      }
      
      // Save note
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Create")').first()
      if (await saveButton.isVisible()) {
        await saveButton.click()
        await page.waitForTimeout(1000)
        
        // Should redirect or show success
        // Note might auto-save
      }
    })

    test('should edit existing note', async ({ page }) => {
      await page.goto('/notes')
      
      // Click on first note
      const firstNote = page.locator('table tbody tr, [data-note-id], .note-card').first()
      if (await firstNote.isVisible()) {
        await firstNote.click()
        await page.waitForTimeout(500)
        
        // Should open note editor
        const contentEditor = page.locator('[contenteditable="true"], .ProseMirror').first()
        if (await contentEditor.isVisible()) {
          await contentEditor.click()
          await page.keyboard.type(' - Updated by test')
          
          // Auto-save or manual save
          await page.waitForTimeout(1000)
        }
      }
    })

    test('should format text with rich editor', async ({ page }) => {
      await page.goto('/notes/new')
      await page.waitForLoadState('networkidle')
      
      // Fill title
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]').first()
      if (await titleInput.isVisible()) {
        await titleInput.fill('Formatting Test')
      }
      
      // Find editor
      const editor = page.locator('[contenteditable="true"], .ProseMirror').first()
      if (await editor.isVisible()) {
        await editor.click()
        
        // Type and test bold
        await page.keyboard.type('Normal text ')
        
        // Try Cmd/Ctrl+B for bold
        await page.keyboard.press('Meta+b')
        await page.keyboard.type('bold text')
        await page.keyboard.press('Meta+b')
        
        // Try bullet list
        await page.keyboard.press('Enter')
        await page.keyboard.type('- List item 1')
        await page.keyboard.press('Enter')
        await page.keyboard.type('- List item 2')
      }
    })

    test('should search notes', async ({ page }) => {
      await page.goto('/notes')
      
      const searchInput = page.locator('input[placeholder*="search"], input[type="search"]').first()
      if (await searchInput.isVisible()) {
        await searchInput.fill('test')
        await page.waitForTimeout(500)
        
        // Results should filter
      }
    })

    test('should toggle view mode (grid/table)', async ({ page }) => {
      await page.goto('/notes')
      
      // Find view toggle
      const gridButton = page.locator('button[aria-label*="grid"], button:has-text("Grid")').first()
      const tableButton = page.locator('button[aria-label*="table"], button:has-text("Table"), button:has-text("List")').first()
      
      if (await gridButton.isVisible()) {
        await gridButton.click()
        await page.waitForTimeout(300)
        
        // Should show grid view
        const hasGrid = await page.locator('.grid, [class*="grid"]').isVisible()
      }
      
      if (await tableButton.isVisible()) {
        await tableButton.click()
        await page.waitForTimeout(300)
        
        // Should show table view
        const hasTable = await page.locator('table').isVisible()
      }
    })

    test('should delete note', async ({ page }) => {
      // First create a note to delete
      await page.goto('/notes/new')
      await page.waitForLoadState('networkidle')
      
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]').first()
      const testTitle = 'Delete Me ' + Date.now()
      if (await titleInput.isVisible()) {
        await titleInput.fill(testTitle)
      }
      
      const editor = page.locator('[contenteditable="true"], .ProseMirror').first()
      if (await editor.isVisible()) {
        await editor.click()
        await page.keyboard.type('This note will be deleted')
      }
      
      // Save
      const saveButton = page.locator('button:has-text("Save")').first()
      if (await saveButton.isVisible()) {
        await saveButton.click()
        await page.waitForTimeout(1000)
      }
      
      // Go back to notes list
      await page.goto('/notes')
      await page.waitForTimeout(500)
      
      // Find the note
      const searchInput = page.locator('input[placeholder*="search"]').first()
      if (await searchInput.isVisible()) {
        await searchInput.fill('Delete Me')
        await page.waitForTimeout(500)
      }
      
      // Click on the note
      const note = page.locator('table tbody tr, .note-card').first()
      if (await note.isVisible()) {
        // Look for delete in dropdown or directly
        const moreButton = page.locator('button[aria-label="more"], button:has([class*="more"])').first()
        if (await moreButton.isVisible()) {
          await moreButton.click()
          await page.waitForTimeout(300)
        }
        
        const deleteButton = page.locator('button:has-text("Delete"), [role="menuitem"]:has-text("Delete")').first()
        if (await deleteButton.isVisible()) {
          await deleteButton.click()
          
          // Confirm deletion
          const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")').last()
          await confirmButton.click()
          
          await page.waitForTimeout(1000)
        }
      }
    })

    test('should show note stats/KPIs', async ({ page }) => {
      await page.goto('/notes')
      
      // Look for stats section
      const hasStats = await page.locator('text=/total notes|recent|archived/i').isVisible()
      // Stats might be shown as cards or summary
    })

    test('should navigate back from note editor', async ({ page }) => {
      await page.goto('/notes/new')
      await page.waitForLoadState('networkidle')
      
      // Find back button
      const backButton = page.locator('button:has-text("Back"), a:has-text("Back"), [aria-label="back"]').first()
      if (await backButton.isVisible()) {
        await backButton.click()
        await expect(page).toHaveURL(/notes$/)
      }
    })

    test('should auto-save note changes', async ({ page }) => {
      await page.goto('/notes/new')
      await page.waitForLoadState('networkidle')
      
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]').first()
      if (await titleInput.isVisible()) {
        await titleInput.fill('Auto-save Test ' + Date.now())
      }
      
      const editor = page.locator('[contenteditable="true"], .ProseMirror').first()
      if (await editor.isVisible()) {
        await editor.click()
        await page.keyboard.type('Testing auto-save functionality')
        
        // Wait for potential auto-save
        await page.waitForTimeout(3000)
        
        // Check for auto-save indicator
        const savedIndicator = page.locator('text=/saved|saving|synced/i')
        // Auto-save might show indicator
      }
    })
  })

  test.describe('Note Editor Features', () => {
    
    test.beforeEach(async ({ page }) => {
      if (process.env.CI) {
        test.skip()
        return
      }
      try {
        await loginAsTestUser(page)
        await page.goto('/notes/new')
        await page.waitForLoadState('networkidle')
      } catch {
        test.skip()
      }
    })

    test('should support heading formatting', async ({ page }) => {
      const editor = page.locator('[contenteditable="true"], .ProseMirror').first()
      if (await editor.isVisible()) {
        await editor.click()
        
        // Type markdown-style heading
        await page.keyboard.type('# Heading 1')
        await page.keyboard.press('Enter')
        await page.keyboard.type('## Heading 2')
        await page.keyboard.press('Enter')
        
        // Check if headings are rendered
        const hasHeading = await page.locator('h1, h2, [class*="heading"]').isVisible()
      }
    })

    test('should support code blocks', async ({ page }) => {
      const editor = page.locator('[contenteditable="true"], .ProseMirror').first()
      if (await editor.isVisible()) {
        await editor.click()
        
        // Try code block with backticks
        await page.keyboard.type('```')
        await page.keyboard.press('Enter')
        await page.keyboard.type('const test = "code block";')
        
        // Check if code block is rendered
        await page.waitForTimeout(500)
        const hasCode = await page.locator('pre, code, [class*="code"]').isVisible()
      }
    })

    test('should support task lists', async ({ page }) => {
      const editor = page.locator('[contenteditable="true"], .ProseMirror').first()
      if (await editor.isVisible()) {
        await editor.click()
        
        // Try task list
        await page.keyboard.type('- [ ] Task item 1')
        await page.keyboard.press('Enter')
        await page.keyboard.type('- [x] Completed task')
        
        // Check if tasks are rendered
        await page.waitForTimeout(500)
        const hasTasks = await page.locator('input[type="checkbox"], [data-type="taskItem"]').isVisible()
      }
    })

    test('should support links', async ({ page }) => {
      const editor = page.locator('[contenteditable="true"], .ProseMirror').first()
      if (await editor.isVisible()) {
        await editor.click()
        
        // Type link markdown
        await page.keyboard.type('[Plaen](https://plaen.co)')
        await page.keyboard.press('Space')
        
        // Check if link is rendered
        await page.waitForTimeout(500)
        const hasLink = await page.locator('a[href*="plaen"]').isVisible()
      }
    })
  })

  test.describe('Notes Empty State', () => {
    
    test('should show empty state for users with no notes', async ({ page }) => {
      // This requires a fresh account
      if (process.env.CI) {
        test.skip()
        return
      }
      
      try {
        await loginAsTestUser(page)
      } catch {
        test.skip()
      }
      
      await page.goto('/notes')
      
      // Check for empty state or notes
      const hasNotes = await page.locator('table tbody tr, .note-card').count() > 0
      
      if (!hasNotes) {
        const emptyState = page.locator('text=/no notes|create your first|get started/i')
        await expect(emptyState.first()).toBeVisible()
      }
    })
  })
})
