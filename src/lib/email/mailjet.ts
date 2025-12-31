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
const SENDER_EMAIL = process.env.MAILJET_SENDER_EMAIL || 'noreply@plaen.app'
const SENDER_NAME = process.env.MAILJET_SENDER_NAME || 'Plaen'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://plaen.app'
const EMAIL_LOGO_URL = process.env.MAILJET_LOGO_URL || 'https://plaen.co/logos/plaen-logo.svg'

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
 * Send invoice to customer
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
}): Promise<{ success: boolean; error?: string }> {
  const paymentLink = ensureAbsoluteUrl(params.paymentLink)
  const content = `
    ${emailHeader('New Invoice')}
    <tr>
      <td class="content" style="padding: 40px;">
        <p style="margin: 0 0 20px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Hi <strong>${params.customerName}</strong>,
        </p>
        <p style="margin: 0 0 28px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          You've received a new invoice from <strong>${params.businessName}</strong>. Please review and complete the payment by the due date.
        </p>
        
        ${infoBox([
          { label: 'Invoice Number', value: params.invoiceNumber },
          { label: 'Amount Due', value: `${params.currency} ${params.amount}`, valueColor: BRAND.primary },
          { label: 'Due Date', value: params.dueDate },
        ])}
        
        <div style="margin-top: 32px;">
          ${ctaButton('View Invoice & Pay', paymentLink)}
        </div>
        ${params.businessEmail ? `
        <p style="margin: 28px 0 0; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.6; text-align: center;">
          Questions about this invoice? Contact<br>
          <a href="mailto:${escapeHtmlAttr(params.businessEmail)}" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 500;">${params.businessEmail}</a>
        </p>
        ` : ''}
      </td>
    </tr>
  `

  const text = `
New Invoice from ${params.businessName}

Hi ${params.customerName},

You've received a new invoice from ${params.businessName}.

Invoice Number: ${params.invoiceNumber}
Amount Due: ${params.currency} ${params.amount}
Due Date: ${params.dueDate}

View and pay your invoice: ${params.paymentLink}

Questions? Contact ${params.businessEmail || params.businessName}

—
Sent via Plaen
`

  return sendEmail({
    to: params.customerEmail,
    toName: params.customerName,
    subject: `Invoice ${params.invoiceNumber} from ${params.businessName}`,
    html: emailLayout(content, `You have a new invoice for ${params.currency} ${params.amount} from ${params.businessName}`),
    text,
    customId: `invoice-${params.invoiceNumber}`,
    fromName: params.senderName || params.businessName,
  })
}

/**
 * Send payment confirmation
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
  
  const content = `
    ${emailHeader(isPaidInFull ? '✓ Payment Complete' : 'Payment Received', BRAND.success)}
    <tr>
      <td class="content" style="padding: 40px;">
        <p style="margin: 0 0 20px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Hi <strong>${params.recipientName}</strong>,
        </p>
        <p style="margin: 0 0 28px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          ${isPaidInFull 
            ? `Great news! Invoice <strong>${params.invoiceNumber}</strong> has been paid in full. Thank you for your payment!`
            : `We've received a partial payment for invoice <strong>${params.invoiceNumber}</strong>. Thank you!`
          }
        </p>
        
        ${infoBox([
          { label: 'Amount Paid', value: `${params.currency} ${params.amountPaid}`, valueColor: BRAND.success },
          { label: 'Payment Method', value: params.paymentMethod },
          { label: 'Payment Date', value: params.paymentDate },
          ...(!isPaidInFull ? [{ label: 'Remaining Balance', value: `${params.currency} ${params.remainingBalance}`, valueColor: BRAND.warning }] : []),
        ])}
        
        ${params.receiptLink ? `
        <div style="margin-top: 32px;">
          ${ctaButton('View Receipt', params.receiptLink)}
        </div>
        ` : ''}
        
        <p style="margin: 28px 0 0; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.6; text-align: center;">
          Thank you for your business!<br>
          <strong>${params.businessName}</strong>
        </p>
      </td>
    </tr>
  `

  const text = `
${isPaidInFull ? 'Payment Complete' : 'Payment Received'}

Hi ${params.recipientName},

${isPaidInFull 
  ? `Great news! Invoice ${params.invoiceNumber} has been paid in full.`
  : `We've received a partial payment for invoice ${params.invoiceNumber}.`
}

Amount Paid: ${params.currency} ${params.amountPaid}
Payment Method: ${params.paymentMethod}
Payment Date: ${params.paymentDate}
${!isPaidInFull ? `Remaining Balance: ${params.currency} ${params.remainingBalance}` : ''}

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
      ? `✓ Payment Complete - Invoice ${params.invoiceNumber}` 
      : `Payment Received - Invoice ${params.invoiceNumber}`,
    html: emailLayout(content, `Payment of ${params.currency} ${params.amountPaid} received for invoice ${params.invoiceNumber}`),
    text,
    customId: `payment-${params.invoiceNumber}-${Date.now()}`,
  })
}

/**
 * Send payment reminder for overdue invoice
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
  const urgencyColor = params.daysOverdue > 30 ? BRAND.danger : BRAND.warning
  const urgencyText = params.daysOverdue > 30 ? 'Overdue' : 'Reminder'
  const bgColor = params.daysOverdue > 30 ? '#fef2f2' : '#fffbeb'
  const borderColor = params.daysOverdue > 30 ? '#fecaca' : '#fde68a'
  
  const content = `
    ${emailHeader(`Payment ${urgencyText}`, urgencyColor)}
    <tr>
      <td class="content" style="padding: 40px;">
        <p style="margin: 0 0 20px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          Hi <strong>${params.customerName}</strong>,
        </p>
        <p style="margin: 0 0 28px; color: ${BRAND.text}; font-size: 16px; line-height: 1.6;">
          This is a friendly reminder that invoice <strong>${params.invoiceNumber}</strong> from <strong>${params.businessName}</strong> is now <span style="color: ${urgencyColor}; font-weight: 600;">${params.daysOverdue} days past due</span>.
        </p>
        
        <table role="presentation" width="100%" style="background-color: ${bgColor}; border-radius: 12px; border: 1px solid ${borderColor};">
          <tr>
            <td style="padding: 20px 24px;">
              <table role="presentation" width="100%">
                <tr>
                  <td style="padding: 0 0 0;">
                    <p style="margin: 0 0 4px; color: ${BRAND.textLight}; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Invoice Number</p>
                    <p style="margin: 0; color: ${BRAND.text}; font-size: 16px; font-weight: 600;">${params.invoiceNumber}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0;">
                    <p style="margin: 0 0 4px; color: ${BRAND.textLight}; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Amount Due</p>
                    <p style="margin: 0; color: ${urgencyColor}; font-size: 28px; font-weight: 700;">${params.currency} ${params.amount}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0;">
                    <p style="margin: 0 0 4px; color: ${BRAND.textLight}; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Original Due Date</p>
                    <p style="margin: 0; color: ${BRAND.text}; font-size: 16px; font-weight: 600;">${params.dueDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <div style="margin-top: 32px;">
          ${ctaButton('Pay Now', params.paymentLink)}
        </div>
        
        <p style="margin: 28px 0 0; color: ${BRAND.textLight}; font-size: 14px; line-height: 1.6; text-align: center;">
          If you've already made this payment, please disregard this reminder.<br>
          Questions? Contact <a href="mailto:${params.businessEmail || ''}" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 500;">${params.businessEmail || params.businessName}</a>
        </p>
      </td>
    </tr>
  `

  const text = `
Payment ${urgencyText} - ${params.daysOverdue} Days Overdue

Hi ${params.customerName},

This is a friendly reminder that invoice ${params.invoiceNumber} from ${params.businessName} is now ${params.daysOverdue} days past due.

Invoice Number: ${params.invoiceNumber}
Amount Due: ${params.currency} ${params.amount}
Original Due Date: ${params.dueDate}

Pay now: ${params.paymentLink}

If you've already made this payment, please disregard this reminder.
Questions? Contact ${params.businessEmail || params.businessName}

—
Sent via Plaen
`

  return sendEmail({
    to: params.customerEmail,
    toName: params.customerName,
    subject: `${urgencyText}: Invoice ${params.invoiceNumber} is ${params.daysOverdue} days overdue`,
    html: emailLayout(content, `Invoice ${params.invoiceNumber} is ${params.daysOverdue} days overdue - ${params.currency} ${params.amount}`),
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
