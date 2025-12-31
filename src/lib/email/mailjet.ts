/**
 * Mailjet Email Service
 * 
 * Beautiful email templates matching Plaen's UI design system.
 * Brand color: #14462a (dark green)
 * 
 * Handles:
 * - Invoice sent notifications
 * - Payment confirmations
 * - Payment reminders
 * - OTP verification codes
 * - Welcome emails
 * - Password reset
 */

// Types for Mailjet API
interface EmailRecipient {
  Email: string
  Name?: string
}

interface EmailMessage {
  From: EmailRecipient
  To: EmailRecipient[]
  Subject: string
  TextPart?: string
  HTMLPart: string
  CustomID?: string
}

interface SendEmailParams {
  to: string
  toName?: string
  subject: string
  html: string
  text?: string
  customId?: string
  fromName?: string
}

// Environment variables
const MAILJET_API_KEY = process.env.MAILJET_API_KEY
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY
const SENDER_EMAIL = process.env.MAILJET_SENDER_EMAIL || 'noreply@plaen.tech'
const SENDER_NAME = process.env.MAILJET_SENDER_NAME || 'Plaen'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://plaen.tech'
// Inline SVG as base64 - most reliable for email clients
const PLAEN_LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMyAzSDEyVjEySDNWM1oiIGZpbGw9IiMxNDQ2MmEiLz48cGF0aCBkPSJNMTQgM0gyMUwxNy41IDEySDE0VjNaIiBmaWxsPSIjMTQ0NjJhIi8+PHBhdGggZD0iTTEyIDE0SDIxVjIxSDEyVjE0WiIgZmlsbD0iIzE0NDYyYSIvPjwvc3ZnPg=='
const EMAIL_LOGO_URL = process.env.MAILJET_LOGO_URL || PLAEN_LOGO_BASE64

// Brand colors
const BRAND = {
  primary: '#14462a',
  primaryLight: '#1a5c38',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  text: '#1f2937',
  textLight: '#6b7280',
  textMuted: '#9ca3af',
  background: '#f8fafc',
  cardBg: '#ffffff',
  border: '#e5e7eb',
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function ensureAbsoluteUrl(url: string): string {
  const trimmed = String(url || '').trim()
  if (!trimmed) return APP_URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  if (trimmed.startsWith('/')) return APP_URL.replace(/\/$/, '') + trimmed
  return `https://${trimmed}`
}

function logoMarkup(): string {
  const logoUrl = ensureAbsoluteUrl(EMAIL_LOGO_URL)
  return `
    <img src="${escapeHtmlAttr(logoUrl)}" width="32" height="32" alt="Plaen" style="display:block; width:32px; height:32px;" />
  `
}

/**
 * Base email layout wrapper
 */
function emailLayout(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Plaen</title>
  ${preheader ? `<span style="display: none; max-height: 0; overflow: hidden;">${preheader}</span>` : ''}
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    .button:hover {
      background-color: ${BRAND.primaryLight} !important;
    }
    
    @media only screen and (max-width: 620px) {
      .container {
        width: 100% !important;
        padding: 0 16px !important;
      }
      .content {
        padding: 24px 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.background}; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" style="background-color: ${BRAND.background};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" class="container" width="600" style="max-width: 600px; background-color: ${BRAND.cardBg}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
          ${content}
        </table>
        
        <!-- Footer -->
        <table role="presentation" width="600" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td align="center" style="padding: 0 20px;">
              <p style="margin: 0 0 8px; color: ${BRAND.textMuted}; font-size: 13px;">
                Sent with ♥ by <a href="${APP_URL}" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 500;">Plaen</a>
              </p>
              <p style="margin: 0; color: ${BRAND.textMuted}; font-size: 12px;">
                Simple invoicing for African businesses
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Email header with logo and optional title
 */
function emailHeader(title?: string, bgColor: string = BRAND.primary): string {
  return `
  <tr>
    <td style="padding: 28px 40px; background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}ee 100%);">
      <table role="presentation" width="100%">
        <tr>
          <td>
            <table role="presentation">
              <tr>
                <td style="padding-right: 12px; vertical-align: middle;">
                  ${logoMarkup()}
                </td>
                <td style="vertical-align: middle;">
                  <span style="color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Plaen</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ${title ? `
        <tr>
          <td style="padding-top: 20px;">
            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 600; letter-spacing: -0.5px;">${title}</h1>
          </td>
        </tr>
        ` : ''}
      </table>
    </td>
  </tr>
`
}

/**
 * Primary CTA button
 */
function ctaButton(text: string, href: string, color: string = BRAND.primary): string {
  const safeHref = ensureAbsoluteUrl(href)
  return `
  <table role="presentation" width="100%">
    <tr>
      <td align="center" style="padding: 8px 0;">
        <a href="${escapeHtmlAttr(safeHref)}" target="_blank" rel="noopener noreferrer" class="button" style="display: inline-block; padding: 14px 32px; background-color: ${color}; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 15px; font-weight: 600; letter-spacing: -0.2px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>
`
}

/**
 * Info box component
 */
function infoBox(items: Array<{ label: string; value: string; valueColor?: string; large?: boolean }>): string {
  return `
  <table role="presentation" width="100%" style="background-color: ${BRAND.background}; border-radius: 12px; border: 1px solid ${BRAND.border};">
    <tr>
      <td style="padding: 20px 24px;">
        <table role="presentation" width="100%">
          ${items.map((item, i) => `
          <tr>
            <td style="padding: ${i === 0 ? '0' : '12px'} 0 0;">
              <p style="margin: 0 0 4px; color: ${BRAND.textLight}; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">${item.label}</p>
              <p style="margin: 0; color: ${item.valueColor || BRAND.text}; font-size: ${item.large || item.valueColor ? '28px' : '16px'}; font-weight: ${item.large || item.valueColor ? '700' : '600'};">${item.value}</p>
            </td>
          </tr>
          `).join('')}
        </table>
      </td>
    </tr>
  </table>
`
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!(MAILJET_API_KEY && MAILJET_SECRET_KEY)
}

/**
 * Send an email via Mailjet API
 */
export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn('Mailjet not configured - skipping email send')
    return { success: false, error: 'Email service not configured' }
  }

  const message: EmailMessage = {
    From: {
      Email: SENDER_EMAIL,
      Name: params.fromName || SENDER_NAME,
    },
    To: [
      {
        Email: params.to,
        Name: params.toName,
      },
    ],
    Subject: params.subject,
    HTMLPart: params.html,
    TextPart: params.text,
    CustomID: params.customId,
  }

  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString('base64')}`,
      },
      body: JSON.stringify({
        Messages: [message],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Mailjet API error:', data)
      return { success: false, error: data.ErrorMessage || 'Failed to send email' }
    }

    const messageId = data.Messages?.[0]?.To?.[0]?.MessageID
    return { success: true, messageId }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============================================
// TRANSACTIONAL EMAIL TEMPLATES
// ============================================

/**
 * Send invoice to customer - Clean, minimal invoice email matching preview UI
 */
export async function sendInvoiceEmail(params: {
  customerEmail: string
  customerName: string
  invoiceNumber: string
  amount: string
  currency: string
  dueDate: string
  paymentLink: string
  businessName: string
  senderName?: string
  businessEmail?: string
  issueDate?: string
  items?: Array<{ description: string; quantity: number; unit_price: number }>
}): Promise<{ success: boolean; error?: string }> {
  const paymentLink = ensureAbsoluteUrl(params.paymentLink)
  const currencySymbol = params.currency === 'GHS' ? '₵' : params.currency === 'USD' ? '$' : params.currency + ' '
  
  // Calculate subtotal from items
  const subtotal = params.items?.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) || parseFloat(params.amount.replace(/,/g, ''))
  
  // Build line items HTML - matching preview UI style
  const itemsHtml = params.items && params.items.length > 0 ? `
        <!-- Line Items Header -->
        <table role="presentation" width="100%" style="margin-top: 32px; border-bottom: 1px solid #E4E6EB;">
          <tr>
            <td style="width: 50%; padding: 12px 0;">
              <p style="margin: 0; color: #B0B3B8; font-size: 13px; font-weight: 500;">Description</p>
            </td>
            <td style="width: 15%; text-align: center; padding: 12px 0;">
              <p style="margin: 0; color: #B0B3B8; font-size: 13px; font-weight: 500;">Qty</p>
            </td>
            <td style="width: 17%; text-align: right; padding: 12px 0;">
              <p style="margin: 0; color: #B0B3B8; font-size: 13px; font-weight: 500;">Rate</p>
            </td>
            <td style="width: 18%; text-align: right; padding: 12px 0;">
              <p style="margin: 0; color: #B0B3B8; font-size: 13px; font-weight: 500;">Amount</p>
            </td>
          </tr>
        </table>
        
        <!-- Line Items Rows -->
        ${params.items.map(item => `
        <table role="presentation" width="100%" style="border-bottom: 1px solid #F3F4F6;">
          <tr>
            <td style="width: 50%; padding: 16px 0;">
              <p style="margin: 0; color: #2D2D2D; font-size: 14px; font-weight: 500;">${item.description}</p>
            </td>
            <td style="width: 15%; text-align: center; padding: 16px 0;">
              <p style="margin: 0; color: #2D2D2D; font-size: 14px; font-weight: 500;">${item.quantity}</p>
            </td>
            <td style="width: 17%; text-align: right; padding: 16px 0;">
              <p style="margin: 0; color: #2D2D2D; font-size: 14px; font-weight: 500;">${currencySymbol}${item.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </td>
            <td style="width: 18%; text-align: right; padding: 16px 0;">
              <p style="margin: 0; color: #2D2D2D; font-size: 14px; font-weight: 500;">${currencySymbol}${(item.quantity * item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </td>
          </tr>
        </table>
        `).join('')}
  ` : ''
  
  // Invoice email content - clean, minimal, matching preview UI
  const invoiceContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Invoice ${params.invoiceNumber}</title>
  <span style="display: none; max-height: 0; overflow: hidden;">Invoice ${params.invoiceNumber} for ${currencySymbol}${params.amount} from ${params.businessName}</span>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" style="background-color: #F8F9FA;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Invoice Container -->
        <table role="presentation" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 48px 32px;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="vertical-align: top;">
                    <!-- Logo Blocks -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 16px;">
                      <tr>
                        <td style="width: 16px; height: 16px; background-color: #14462a;"></td>
                        <td style="width: 3px;"></td>
                        <td style="width: 10px; height: 16px; background-color: #14462a; border-radius: 0 3px 0 0;"></td>
                      </tr>
                      <tr><td colspan="3" style="height: 3px;"></td></tr>
                      <tr>
                        <td style="width: 16px; height: 10px;"></td>
                        <td style="width: 3px;"></td>
                        <td style="width: 10px; height: 10px; background-color: #14462a;"></td>
                      </tr>
                    </table>
                    <p style="margin: 0 0 4px; color: #2D2D2D; font-size: 24px; font-weight: 700;">${params.businessName}</p>
                    ${params.businessEmail ? `<p style="margin: 0; color: #B0B3B8; font-size: 13px;">${params.businessEmail}</p>` : ''}
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <p style="margin: 0 0 4px; color: #B0B3B8; font-size: 13px;">Invoice</p>
                    <p style="margin: 0; color: #2D2D2D; font-size: 20px; font-weight: 700;">${params.invoiceNumber}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Dates Row -->
          <tr>
            <td style="padding: 0 48px 24px;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="width: 50%;">
                    <p style="margin: 0 0 4px; color: #B0B3B8; font-size: 13px;">Issue Date</p>
                    <p style="margin: 0; color: #2D2D2D; font-size: 15px; font-weight: 500;">${params.issueDate || 'Today'}</p>
                  </td>
                  <td style="width: 50%;">
                    <p style="margin: 0 0 4px; color: #B0B3B8; font-size: 13px;">Due Date</p>
                    <p style="margin: 0; color: #2D2D2D; font-size: 15px; font-weight: 500;">${params.dueDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Bill To -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0 0 8px; color: #B0B3B8; font-size: 13px;">Bill To</p>
              <p style="margin: 0; color: #2D2D2D; font-size: 15px; font-weight: 500;">${params.customerName}</p>
            </td>
          </tr>
          
          <!-- Line Items Section -->
          <tr>
            <td style="padding: 0 48px;">
              ${itemsHtml}
            </td>
          </tr>
          
          <!-- Totals -->
          <tr>
            <td style="padding: 24px 48px 32px;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="width: 60%;"></td>
                  <td style="width: 40%;">
                    <!-- Subtotal -->
                    <table role="presentation" width="100%" style="margin-bottom: 8px;">
                      <tr>
                        <td style="text-align: right; padding: 8px 0;">
                          <span style="color: #B0B3B8; font-size: 14px;">Subtotal</span>
                        </td>
                        <td style="text-align: right; padding: 8px 0; width: 120px;">
                          <span style="color: #2D2D2D; font-size: 14px; font-weight: 500;">${currencySymbol}${params.amount}</span>
                        </td>
                      </tr>
                    </table>
                    <!-- Total -->
                    <table role="presentation" width="100%" style="border-top: 1px solid #E4E6EB; padding-top: 12px;">
                      <tr>
                        <td style="text-align: right; padding: 12px 0 0;">
                          <span style="color: #2D2D2D; font-size: 16px; font-weight: 600;">Total</span>
                        </td>
                        <td style="text-align: right; padding: 12px 0 0; width: 120px;">
                          <span style="color: #2D2D2D; font-size: 22px; font-weight: 700;">${currencySymbol}${params.amount}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Pay Button -->
          <tr>
            <td style="padding: 0 48px 40px;">
              <table role="presentation" width="100%" style="border-top: 1px solid #E4E6EB; padding-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${escapeHtmlAttr(paymentLink)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 32px; background-color: #14462a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 15px; font-weight: 600;">
                      Pay Invoice Now
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <p style="margin: 0; color: #B0B3B8; font-size: 13px;">
                      Payment link: <a href="${escapeHtmlAttr(paymentLink)}" style="color: #14462a; text-decoration: none;">${paymentLink}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 48px; border-top: 1px solid #E4E6EB; text-align: center;">
              <p style="margin: 0 0 4px; color: #B0B3B8; font-size: 13px;">Thank you for your business!</p>
              <p style="margin: 0; color: #B0B3B8; font-size: 12px;">Powered by <a href="https://plaen.tech" style="color: #14462a; text-decoration: none; font-weight: 500;">Plaen</a></p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `
INVOICE FROM ${params.businessName.toUpperCase()}

Invoice: ${params.invoiceNumber}
Issue Date: ${params.issueDate || 'Today'}
Due Date: ${params.dueDate}

Bill To: ${params.customerName}

${params.items && params.items.length > 0 ? params.items.map(item => `• ${item.description} (${item.quantity}x) - ${currencySymbol}${(item.quantity * item.unit_price).toFixed(2)}`).join('\n') : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: ${currencySymbol}${params.amount}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pay your invoice: ${params.paymentLink}

${params.businessEmail ? `Questions? Contact ${params.businessEmail}` : ''}

Thank you for your business!
—
Powered by Plaen
`

  return sendEmail({
    to: params.customerEmail,
    toName: params.customerName,
    subject: `Invoice ${params.invoiceNumber} from ${params.businessName} • ${currencySymbol}${params.amount}`,
    html: invoiceContent,
    text,
    customId: `invoice-${params.invoiceNumber}`,
    fromName: params.senderName || params.businessName,
  })
}

/**
 * Send payment confirmation - Clean receipt-style email
 */
export async function sendPaymentConfirmationEmail(params: {
  recipientEmail: string
  recipientName: string
  invoiceNumber: string
  amountPaid: string
  currency: string
  paymentMethod: string
  paymentDate: string
  remainingBalance?: string
  receiptLink?: string
  businessName: string
}): Promise<{ success: boolean; error?: string }> {
  const isPaidInFull = !params.remainingBalance || params.remainingBalance === '0' || params.remainingBalance === '0.00'
  const currencySymbol = params.currency === 'GHS' ? '₵' : params.currency === 'USD' ? '$' : params.currency + ' '
  
  const receiptContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Payment Confirmation</title>
  <span style="display: none; max-height: 0; overflow: hidden;">Payment of ${currencySymbol}${params.amountPaid} received for invoice ${params.invoiceNumber}</span>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" style="background-color: #F8F9FA;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
          
          <!-- Success Header -->
          <tr>
            <td style="padding: 40px 48px 24px; text-align: center;">
              <!-- Success Checkmark -->
              <div style="width: 64px; height: 64px; background-color: rgba(20, 70, 42, 0.1); border-radius: 50%; margin: 0 auto 20px; line-height: 64px;">
                <span style="font-size: 32px; color: #14462a;">✓</span>
              </div>
              <h1 style="margin: 0 0 8px; color: #2D2D2D; font-size: 24px; font-weight: 700;">${isPaidInFull ? 'Payment Complete' : 'Payment Received'}</h1>
              <p style="margin: 0; color: #B0B3B8; font-size: 14px;">Invoice ${params.invoiceNumber}</p>
            </td>
          </tr>
          
          <!-- Amount -->
          <tr>
            <td style="padding: 0 48px 32px; text-align: center;">
              <p style="margin: 0 0 4px; color: #B0B3B8; font-size: 13px;">Amount Paid</p>
              <p style="margin: 0; color: #14462a; font-size: 36px; font-weight: 700;">${currencySymbol}${params.amountPaid}</p>
            </td>
          </tr>
          
          <!-- Details Card -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <table role="presentation" width="100%" style="background-color: #F8F9FA; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #E4E6EB;">
                          <p style="margin: 0; color: #B0B3B8; font-size: 13px;">Payment Method</p>
                          <p style="margin: 4px 0 0; color: #2D2D2D; font-size: 15px; font-weight: 500;">${params.paymentMethod}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0 8px;">
                          <p style="margin: 0; color: #B0B3B8; font-size: 13px;">Payment Date</p>
                          <p style="margin: 4px 0 0; color: #2D2D2D; font-size: 15px; font-weight: 500;">${params.paymentDate}</p>
                        </td>
                      </tr>
                      ${!isPaidInFull ? `
                      <tr>
                        <td style="padding: 12px 0 0; border-top: 1px solid #E4E6EB;">
                          <p style="margin: 0; color: #B0B3B8; font-size: 13px;">Remaining Balance</p>
                          <p style="margin: 4px 0 0; color: #D97706; font-size: 15px; font-weight: 600;">${currencySymbol}${params.remainingBalance}</p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- View Receipt Button -->
          ${params.receiptLink ? `
          <tr>
            <td style="padding: 0 48px 40px;">
              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <a href="${escapeHtmlAttr(params.receiptLink)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 32px; background-color: #14462a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 15px; font-weight: 600;">
                      View Receipt
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 48px; border-top: 1px solid #E4E6EB; text-align: center;">
              <p style="margin: 0 0 4px; color: #B0B3B8; font-size: 13px;">Thank you for your payment!</p>
              <p style="margin: 0 0 8px; color: #2D2D2D; font-size: 14px; font-weight: 500;">${params.businessName}</p>
              <p style="margin: 0; color: #B0B3B8; font-size: 12px;">Powered by <a href="https://plaen.tech" style="color: #14462a; text-decoration: none; font-weight: 500;">Plaen</a></p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `
${isPaidInFull ? 'PAYMENT COMPLETE' : 'PAYMENT RECEIVED'}

Invoice ${params.invoiceNumber}

Amount Paid: ${currencySymbol}${params.amountPaid}
Payment Method: ${params.paymentMethod}
Payment Date: ${params.paymentDate}
${!isPaidInFull ? `Remaining Balance: ${currencySymbol}${params.remainingBalance}` : ''}

${params.receiptLink ? `View your receipt: ${params.receiptLink}` : ''}

Thank you for your business!
${params.businessName}

—
Powered by Plaen
`

  return sendEmail({
    to: params.recipientEmail,
    toName: params.recipientName,
    subject: isPaidInFull 
      ? `✓ Payment Complete • Invoice ${params.invoiceNumber}` 
      : `Payment Received • Invoice ${params.invoiceNumber}`,
    html: receiptContent,
    text,
    customId: `payment-${params.invoiceNumber}-${Date.now()}`,
  })
}

/**
 * Send payment reminder for overdue invoice - Clean style
 */
export async function sendPaymentReminderEmail(params: {
  customerEmail: string
  customerName: string
  invoiceNumber: string
  amount: string
  currency: string
  dueDate: string
  daysOverdue: number
  paymentLink: string
  businessName: string
  businessEmail?: string
}): Promise<{ success: boolean; error?: string }> {
  const paymentLink = ensureAbsoluteUrl(params.paymentLink)
  const currencySymbol = params.currency === 'GHS' ? '₵' : params.currency === 'USD' ? '$' : params.currency + ' '
  const isUrgent = params.daysOverdue > 30
  const statusColor = isUrgent ? '#DC2626' : '#D97706'
  const statusBg = isUrgent ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)'
  
  const reminderContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Payment Reminder</title>
  <span style="display: none; max-height: 0; overflow: hidden;">Invoice ${params.invoiceNumber} is ${params.daysOverdue} days overdue - ${currencySymbol}${params.amount}</span>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" style="background-color: #F8F9FA;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" width="600" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 48px 24px;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="vertical-align: top;">
                    <!-- Logo Blocks -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 16px;">
                      <tr>
                        <td style="width: 16px; height: 16px; background-color: #14462a;"></td>
                        <td style="width: 3px;"></td>
                        <td style="width: 10px; height: 16px; background-color: #14462a; border-radius: 0 3px 0 0;"></td>
                      </tr>
                      <tr><td colspan="3" style="height: 3px;"></td></tr>
                      <tr>
                        <td style="width: 16px; height: 10px;"></td>
                        <td style="width: 3px;"></td>
                        <td style="width: 10px; height: 10px; background-color: #14462a;"></td>
                      </tr>
                    </table>
                    <p style="margin: 0; color: #2D2D2D; font-size: 24px; font-weight: 700;">${params.businessName}</p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <span style="display: inline-block; padding: 6px 12px; background-color: ${statusBg}; color: ${statusColor}; font-size: 13px; font-weight: 600; border-radius: 20px;">
                      ${params.daysOverdue} days overdue
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="padding: 0 48px 24px;">
              <p style="margin: 0 0 8px; color: #B0B3B8; font-size: 14px;">Hi ${params.customerName},</p>
              <p style="margin: 0; color: #2D2D2D; font-size: 15px; line-height: 1.6;">
                This is a friendly reminder that invoice <strong>${params.invoiceNumber}</strong> was due on <strong>${params.dueDate}</strong>.
              </p>
            </td>
          </tr>
          
          <!-- Amount Due -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <table role="presentation" width="100%" style="background-color: ${statusBg}; border-radius: 8px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 4px; color: #B0B3B8; font-size: 13px;">Amount Due</p>
                    <p style="margin: 0; color: ${statusColor}; font-size: 32px; font-weight: 700;">${currencySymbol}${params.amount}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Pay Button -->
          <tr>
            <td style="padding: 0 48px 40px;">
              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <a href="${escapeHtmlAttr(paymentLink)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 32px; background-color: #14462a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 15px; font-weight: 600;">
                      Pay Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 48px; border-top: 1px solid #E4E6EB; text-align: center;">
              <p style="margin: 0 0 8px; color: #B0B3B8; font-size: 13px;">If you've already made this payment, please disregard this reminder.</p>
              ${params.businessEmail ? `<p style="margin: 0 0 8px; color: #B0B3B8; font-size: 13px;">Questions? <a href="mailto:${params.businessEmail}" style="color: #14462a; text-decoration: none; font-weight: 500;">${params.businessEmail}</a></p>` : ''}
              <p style="margin: 0; color: #B0B3B8; font-size: 12px;">Powered by <a href="https://plaen.tech" style="color: #14462a; text-decoration: none; font-weight: 500;">Plaen</a></p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `
PAYMENT REMINDER - ${params.daysOverdue} DAYS OVERDUE

Hi ${params.customerName},

This is a friendly reminder that invoice ${params.invoiceNumber} was due on ${params.dueDate}.

Amount Due: ${currencySymbol}${params.amount}

Pay now: ${params.paymentLink}

If you've already made this payment, please disregard this reminder.
${params.businessEmail ? `Questions? Contact ${params.businessEmail}` : ''}

—
${params.businessName}
Sent via Plaen
`

  return sendEmail({
    to: params.customerEmail,
    toName: params.customerName,
    subject: `Reminder: Invoice ${params.invoiceNumber} • ${currencySymbol}${params.amount} overdue`,
    html: reminderContent,
    text,
    customId: `reminder-${params.invoiceNumber}-${Date.now()}`,
  })
}

// ============================================
// AUTH EMAIL TEMPLATES
// ============================================

/**
 * Send OTP verification code
 */
export async function sendOTPEmail(params: {
  email: string
  name?: string
  code: string
  expiryMinutes?: number
}): Promise<{ success: boolean; error?: string }> {
  const expiry = params.expiryMinutes || 10
  
  const content = `
    ${emailHeader('Verify Your Email')}
    <tr>
      <td class="content" style="padding: 40px;">
        <p style="margin: 0 0 20px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Hi${params.name ? ` <strong>${params.name}</strong>` : ''},
        </p>
        <p style="margin: 0 0 28px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Use the verification code below to complete your sign-in. This code will expire in ${expiry} minutes.
        </p>
        
        <!-- OTP Code Box -->
        <table role="presentation" width="100%" style="margin-bottom: 28px;">
          <tr>
            <td align="center">
              <div style="display: inline-block; padding: 20px 40px; background: linear-gradient(135deg, ${BRAND.primary}08 0%, ${BRAND.primary}15 100%); border: 2px dashed ${BRAND.primary}40; border-radius: 12px;">
                <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: ${BRAND.primary}; font-family: 'SF Mono', 'Consolas', monospace;">${params.code}</p>
              </div>
            </td>
          </tr>
        </table>
        
        <p style="margin: 0; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.6; text-align: center;">
          If you didn't request this code, you can safely ignore this email.<br>
          Someone may have entered your email by mistake.
        </p>
      </td>
    </tr>
  `

  const text = `
Verify Your Email

Hi${params.name ? ` ${params.name}` : ''},

Use the verification code below to complete your sign-in:

${params.code}

This code will expire in ${expiry} minutes.

If you didn't request this code, you can safely ignore this email.

—
Plaen
`

  return sendEmail({
    to: params.email,
    toName: params.name,
    subject: `${params.code} is your Plaen verification code`,
    html: emailLayout(content, `Your Plaen verification code is ${params.code}`),
    text,
    customId: `otp-${Date.now()}`,
  })
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(params: {
  email: string
  name: string
}): Promise<{ success: boolean; error?: string }> {
  const content = `
    ${emailHeader('Welcome to Plaen! 🎉')}
    <tr>
      <td class="content" style="padding: 40px;">
        <p style="margin: 0 0 20px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Hi <strong>${params.name}</strong>,
        </p>
        <p style="margin: 0 0 24px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Welcome to Plaen! You've just unlocked the simplest way to create professional invoices and get paid faster.
        </p>
        
        <!-- Features Grid -->
        <table role="presentation" width="100%" style="margin-bottom: 28px;">
          <tr>
            <td style="padding: 16px; background-color: ${BRAND.background}; border-radius: 12px;">
              <table role="presentation" width="100%">
                <tr>
                  <td width="40" valign="top" style="padding-right: 12px;">
                    <div style="width: 32px; height: 32px; background-color: ${BRAND.primary}15; border-radius: 8px; text-align: center; line-height: 32px; font-size: 16px;">📄</div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px; color: ${BRAND.text}; font-size: 14px; font-weight: 600;">Create Your First Invoice</p>
                    <p style="margin: 0; color: ${BRAND.textLight}; font-size: 13px;">Beautiful invoices in under 2 minutes</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px; background-color: ${BRAND.background}; border-radius: 12px; padding-top: 8px;">
              <table role="presentation" width="100%">
                <tr>
                  <td width="40" valign="top" style="padding-right: 12px;">
                    <div style="width: 32px; height: 32px; background-color: ${BRAND.primary}15; border-radius: 8px; text-align: center; line-height: 32px; font-size: 16px;">💸</div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px; color: ${BRAND.text}; font-size: 14px; font-weight: 600;">Accept Multiple Payment Methods</p>
                    <p style="margin: 0; color: ${BRAND.textLight}; font-size: 13px;">Mobile Money, Bank Transfer, Card & Crypto</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px; background-color: ${BRAND.background}; border-radius: 12px; padding-top: 8px;">
              <table role="presentation" width="100%">
                <tr>
                  <td width="40" valign="top" style="padding-right: 12px;">
                    <div style="width: 32px; height: 32px; background-color: ${BRAND.primary}15; border-radius: 8px; text-align: center; line-height: 32px; font-size: 16px;">📊</div>
                  </td>
                  <td>
                    <p style="margin: 0 0 4px; color: ${BRAND.text}; font-size: 14px; font-weight: 600;">Track Everything</p>
                    <p style="margin: 0; color: ${BRAND.textLight}; font-size: 13px;">Dashboard with real-time insights</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        ${ctaButton('Go to Dashboard', `${APP_URL}/dashboard`)}
        
        <p style="margin: 28px 0 0; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.6; text-align: center;">
          Need help getting started?<br>
          Check out our <a href="${APP_URL}/help/getting-started" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 500;">Getting Started Guide</a>
        </p>
      </td>
    </tr>
  `

  const text = `
Welcome to Plaen! 🎉

Hi ${params.name},

Welcome to Plaen! You've just unlocked the simplest way to create professional invoices and get paid faster.

Here's what you can do:
• Create Your First Invoice - Beautiful invoices in under 2 minutes
• Accept Multiple Payment Methods - Mobile Money, Bank Transfer, Card & Crypto
• Track Everything - Dashboard with real-time insights

Get started: ${APP_URL}/dashboard

Need help? Check out our Getting Started Guide: ${APP_URL}/help/getting-started

—
The Plaen Team
`

  return sendEmail({
    to: params.email,
    toName: params.name,
    subject: `Welcome to Plaen, ${params.name}! 🎉`,
    html: emailLayout(content, 'Welcome to Plaen! Start creating professional invoices today.'),
    text,
    customId: `welcome-${Date.now()}`,
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  email: string
  name?: string
  resetLink: string
  expiryHours?: number
}): Promise<{ success: boolean; error?: string }> {
  const expiry = params.expiryHours || 24
  
  const content = `
    ${emailHeader('Reset Your Password')}
    <tr>
      <td class="content" style="padding: 40px;">
        <p style="margin: 0 0 20px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Hi${params.name ? ` <strong>${params.name}</strong>` : ''},
        </p>
        <p style="margin: 0 0 24px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password. This link will expire in ${expiry} hours.
        </p>
        
        ${ctaButton('Reset Password', params.resetLink)}
        
        <p style="margin: 28px 0 16px; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.6; text-align: center;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
        
        <table role="presentation" width="100%" style="background-color: ${BRAND.background}; border-radius: 8px; margin-top: 24px;">
          <tr>
            <td style="padding: 16px;">
              <p style="margin: 0; color: ${BRAND.textLight}; font-size: 12px; line-height: 1.5;">
                <strong>Security tip:</strong> Never share your password or this link with anyone. Plaen will never ask for your password via email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `

  const text = `
Reset Your Password

Hi${params.name ? ` ${params.name}` : ''},

We received a request to reset your password. Click the link below to create a new password:

${params.resetLink}

This link will expire in ${expiry} hours.

If you didn't request a password reset, you can safely ignore this email.

Security tip: Never share your password or this link with anyone.

—
Plaen
`

  return sendEmail({
    to: params.email,
    toName: params.name,
    subject: 'Reset your Plaen password',
    html: emailLayout(content, 'Reset your Plaen password'),
    text,
    customId: `password-reset-${Date.now()}`,
  })
}

/**
 * Send email verification (different from OTP - uses a link)
 */
export async function sendEmailVerificationEmail(params: {
  email: string
  name?: string
  verificationLink: string
}): Promise<{ success: boolean; error?: string }> {
  const content = `
    ${emailHeader('Verify Your Email')}
    <tr>
      <td class="content" style="padding: 40px;">
        <p style="margin: 0 0 20px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Hi${params.name ? ` <strong>${params.name}</strong>` : ''},
        </p>
        <p style="margin: 0 0 24px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Thanks for signing up for Plaen! Please verify your email address by clicking the button below.
        </p>
        
        ${ctaButton('Verify Email', params.verificationLink)}
        
        <p style="margin: 28px 0 0; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.6; text-align: center;">
          If you didn't create a Plaen account, you can safely ignore this email.
        </p>
      </td>
    </tr>
  `

  const text = `
Verify Your Email

Hi${params.name ? ` ${params.name}` : ''},

Thanks for signing up for Plaen! Please verify your email address:

${params.verificationLink}

If you didn't create a Plaen account, you can safely ignore this email.

—
Plaen
`

  return sendEmail({
    to: params.email,
    toName: params.name,
    subject: 'Verify your Plaen email address',
    html: emailLayout(content, 'Verify your email to get started with Plaen'),
    text,
    customId: `verify-${Date.now()}`,
  })
}
