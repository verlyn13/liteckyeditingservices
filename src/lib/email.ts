/**
 * Email Templates and Utilities
 *
 * Provides branded email templates for contact form and booking notifications.
 * Email delivery is handled by src/lib/postal.ts
 */

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================
// These templates define the content and styling for transactional emails.
// To modify email content or design, edit the functions below.
//
// TEMPLATE EDITING GUIDE:
// ----------------------
// Each template has TWO versions that must be kept in sync:
//
// 1. TEXT VERSION (plain text)
//    - For email clients that don't support HTML or user preference
//    - Must contain all important information
//    - Keep formatting simple and readable
//
// 2. HTML VERSION (rich formatted)
//    - For modern email clients
//    - MUST use inline CSS (external stylesheets don't work in email)
//    - Test in Gmail, Outlook, Apple Mail before deploying changes
//
// DESIGN SYSTEM:
// --------------
// Colors (use hex codes for email compatibility):
//   - Primary blue: #192a51 (headers, emphasis)
//   - Accent green: #5a716a (borders, highlights)
//   - Warning yellow: #f59e0b (quote ID badges)
//   - Light gray: #f7f7f5 (backgrounds)
//   - Dark gray: #2c2c2c (body text)
//   - Border gray: #dee2e6
//
// Typography:
//   - Font stack: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
//   - Line height: 1.6 for readability
//   - Font sizes: Use pixels (not rem/em) for email compatibility
//
// Layout:
//   - Max width: 600px (optimal for email clients)
//   - Padding: 20px minimum for mobile readability
//   - Border radius: 4-8px for modern look
// ============================================================================

/**
 * TEMPLATE: Admin Notification Email
 *
 * Sent to: Admin team
 * Trigger: New contact form submission
 * Purpose: Notify team of new quote request
 *
 * Available Variables:
 * - name: Customer's full name
 * - email: Customer's email address
 * - service: Service requested
 * - deadline: Project deadline
 * - message: Customer's message/details
 * - quoteId: Unique quote identifier
 */
export function createAdminNotification(data: {
  name: string;
  email: string;
  service: string;
  deadline: string;
  message: string;
  quoteId: string;
}): { text: string; html: string } {
  const preheader = `New contact request ${data.name} — ${data.service}`;

  const text = `New Contact Form Submission

Quote ID: ${data.quoteId}
Name: ${data.name}
Email: ${data.email}
Service: ${data.service}
Deadline: ${data.deadline}

Message:
${data.message}

---
Received at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Anchorage' })} (AKT)`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2c2c2c; background: #f7f7f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #192a51; color: #ffffff; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #dee2e6; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #192a51; }
    .value { margin-top: 5px; padding: 10px; background: #f7f7f5; border-radius: 4px; }
    .quote-id { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin-bottom: 20px; }
    .message { white-space: pre-wrap; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Preheader (hidden) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
    <div class="header">
      <h2 style="margin: 0;">New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="quote-id">
        <strong>Quote ID:</strong> ${data.quoteId}
      </div>
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      <div class="field">
        <div class="label">Service:</div>
        <div class="value">${data.service}</div>
      </div>
      <div class="field">
        <div class="label">Deadline:</div>
        <div class="value">${data.deadline}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="value message">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="footer">
        Received at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Anchorage' })} (AKT)
      </div>
    </div>
  </div>
</body>
</html>`;

  return { text, html };
}

/**
 * TEMPLATE: User Confirmation Email
 *
 * Sent to: Customer
 * Trigger: After successful contact form submission
 * Purpose: Confirm receipt and set expectations
 *
 * Available Variables:
 * - name: Customer's first name or full name
 * - service: Service requested
 * - deadline: Project deadline
 * - message: Customer's original message (quoted back)
 * - quoteId: Unique quote identifier for reference
 */
export function createUserConfirmation(data: {
  name: string;
  service: string;
  deadline: string;
  message: string;
  quoteId: string;
}): { text: string; html: string } {
  const preheader = `We received your inquiry — Quote ID ${data.quoteId}`;

  const text = `Thank you for contacting Litecky Editing Services

Dear ${data.name},

We have received your inquiry about ${data.service} with a deadline of ${data.deadline}.

Your Quote ID is: ${data.quoteId}
Please reference this ID in any future correspondence about this inquiry.

We will review your request and respond within 24 hours with a quote and next steps.

Your message:
${data.message}

Best regards,
Litecky Editing Services Team

---
This is an automated confirmation. Please do not reply to this email.
For questions, please email hello@liteckyeditingservices.com`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2c2c2c; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #192a51; color: #ffffff; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #dee2e6; border-radius: 0 0 8px 8px; }
    .quote-id { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; font-size: 18px; }
    .message-box { background: #f7f7f5; padding: 20px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #5a716a; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Preheader (hidden) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
    <div class="header">
      <h1 style="margin: 0;">Thank You for Your Inquiry</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name},</p>

      <p>We have received your inquiry about <strong>${data.service}</strong> with a deadline of <strong>${data.deadline}</strong>.</p>

      <div class="quote-id">
        <strong>Your Quote ID:</strong> ${data.quoteId}<br>
        <small>Please reference this ID in any future correspondence</small>
      </div>

      <p>Our team will review your request and respond within 24 hours with a quote and next steps.</p>

      <div class="message-box">
        <strong>Your message:</strong><br><br>
        ${data.message.replace(/\n/g, '<br>')}
      </div>

      <p>If you have any urgent questions, please feel free to email us at <a href="mailto:hello@liteckyeditingservices.com">hello@liteckyeditingservices.com</a>.</p>

      <p>Best regards,<br>
      <strong>Litecky Editing Services Team</strong></p>

      <div class="footer">
        This is an automated confirmation. Please do not reply to this email.<br>
        For questions, please email <a href="mailto:hello@liteckyeditingservices.com">hello@liteckyeditingservices.com</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  return { text, html };
}

/**
 * Rate limiting helper - tracks submission attempts
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 600000 // 10 minutes
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries
  if (entry && entry.resetAt < now) {
    rateLimitStore.delete(key);
  }

  const current = rateLimitStore.get(key);

  if (!current) {
    // First attempt
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (current.count >= limit) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  // Increment counter
  current.count++;
  return {
    allowed: true,
    remaining: limit - current.count,
    resetAt: current.resetAt,
  };
}

/**
 * Validate email content for spam markers
 */
export function validateContent(message: string): {
  valid: boolean;
  reason?: string;
} {
  // Check minimum length
  if (message.length < 10) {
    return { valid: false, reason: 'Message too short' };
  }

  // Check maximum length
  if (message.length > 10000) {
    return { valid: false, reason: 'Message too long' };
  }

  // Check for excessive links
  const linkPattern = /https?:\/\//gi;
  const links = message.match(linkPattern) || [];
  if (links.length > 5) {
    return { valid: false, reason: 'Too many links' };
  }

  // Check for common spam patterns
  const spamPatterns = [
    /\bcasino\b/i,
    /\bviagra\b/i,
    /\bcrypto\s*currency\b/i,
    /\bget\s*rich\s*quick\b/i,
    /\bmake\s*money\s*fast\b/i,
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(message)) {
      return { valid: false, reason: 'Spam content detected' };
    }
  }

  return { valid: true };
}
