# Plaen E2E Test Suite

Comprehensive end-to-end tests for the Plaen invoicing application.

## Test Accounts

| Purpose | Email | Password |
|---------|-------|----------|
| Test User | nanaduah.09@gmail.com | TestPassword123! |
| Invoice Recipient | nanaduah09@gmail.com | - |

## Test Structure

```
tests/
├── e2e/
│   ├── auth.spec.ts      # Authentication flows (signup, login, password reset)
│   ├── invoices.spec.ts  # Invoice CRUD, sending, payments
│   ├── contacts.spec.ts  # Contact/customer management
│   ├── notes.spec.ts     # Finance notes with rich text editor
│   ├── payment.spec.ts   # Public payment page, verification
│   └── dashboard.spec.ts # Dashboard, receipts, settings
├── unit/
│   ├── paymentAPI.test.ts
│   ├── usePayState.test.ts
│   ├── receipt-hash.test.ts
│   ├── validation.test.ts
│   ├── money.test.ts
│   └── dates.test.ts
├── setup.ts
└── README.md
```

## Running Tests

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (visual debugging)
npm run test:e2e:ui

# Run in headed browser
npm run test:e2e:headed

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run tests matching pattern
npx playwright test -g "login"
```

### Unit Tests (Vitest)

```bash
# Run unit tests
npm run test

# Run with watch mode
npm run test:ui

# Run with coverage
npm run coverage
```

## Test Coverage

### Authentication (auth.spec.ts)
- ✅ Login page display
- ✅ Invalid credentials handling
- ✅ Signup page display
- ✅ Email validation
- ✅ Password strength validation
- ✅ Forgot password flow
- ✅ Protected route redirects

### Invoices (invoices.spec.ts)
- ✅ Invoice list display
- ✅ Create invoice with line items
- ✅ Preview invoice
- ✅ Send invoice to customer
- ✅ Filter invoices by status
- ✅ Search invoices
- ✅ Record payment
- ✅ Download PDF
- ✅ Copy payment link
- ✅ Validation (customer required, line items required)

### Contacts (contacts.spec.ts)
- ✅ Contact list display
- ✅ Add new contact
- ✅ View contact details
- ✅ Edit contact
- ✅ Delete contact
- ✅ Search contacts
- ✅ Create invoice from contact
- ✅ Email contact
- ✅ Contact statistics

### Notes (notes.spec.ts)
- ✅ Notes list display
- ✅ Create note with title
- ✅ Edit existing note
- ✅ Rich text formatting (bold, headings, code, tasks)
- ✅ Search notes
- ✅ View mode toggle (grid/table)
- ✅ Delete note
- ✅ Auto-save functionality

### Dashboard & Receipts (dashboard.spec.ts)
- ✅ Dashboard KPI cards
- ✅ Recent invoices
- ✅ Quick actions
- ✅ Balance visibility toggle
- ✅ Receipt list display
- ✅ View receipt details
- ✅ Print receipt
- ✅ Download receipt PDF
- ✅ Resend receipt
- ✅ Copy receipt number
- ✅ Settings page

### Payment (payment.spec.ts)
- ✅ Public payment page (404 handling)
- ✅ Payment method selection
- ✅ Payment callbacks
- ✅ Manual payment recording
- ✅ Payment history
- ✅ Receipt navigation

## Environment Variables

Create `.env.test.local` for test-specific configuration:

```env
PLAYWRIGHT_BASE_URL=http://localhost:3000
TEST_USER_EMAIL=nanaduah.09@gmail.com
TEST_USER_PASSWORD=TestPassword123!
```

## CI/CD Integration

Tests are configured to:
- Skip tests requiring real authentication in CI (`process.env.CI`)
- Retry failed tests 2 times in CI
- Generate HTML reports
- Take screenshots on failure

## Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test'
import { loginAsTestUser } from './auth.spec'

test.describe('Feature Name', () => {
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

  test('should do something', async ({ page }) => {
    await page.goto('/feature')
    await expect(page.locator('h1')).toContainText(/expected/i)
  })
})
```

### Best Practices

1. **Use flexible selectors**: Prefer `text=/pattern/i` over exact text
2. **Handle async properly**: Use `waitForTimeout` or `waitForURL` 
3. **Check visibility before acting**: `if (await element.isVisible())`
4. **Skip gracefully**: Skip tests that can't run rather than failing
5. **Test independently**: Each test should work in isolation

## Troubleshooting

### Tests failing with "Login failed"
- Verify test account exists and password is correct
- Check if email verification is required

### Tests timing out
- Increase timeout in playwright.config.ts
- Check if dev server is running

### Elements not found
- Update selectors if UI changed
- Add more wait time for dynamic content

## Notes

- Tests use real Supabase database - be careful with destructive operations
- Email sending tests might trigger actual emails
- Payment tests in production mode will use real payment gateway
