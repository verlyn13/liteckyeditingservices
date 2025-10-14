# Email Templates Documentation

## Overview

Email templates for Litecky Editing Services are hardcoded in `src/lib/email.ts` for optimal performance and compatibility with Cloudflare Workers. This approach ensures:

- **Fast execution** - No database queries or external dependencies
- **Edge compatibility** - Works in Cloudflare Workers runtime
- **Version control** - Templates tracked in git with full history
- **Type safety** - TypeScript ensures correct variable usage

## Template Location

**File:** `src/lib/email.ts`
**Lines:** 243-530 (approximately)

## Available Templates

### 1. Admin Notification Email

**Function:** `createAdminNotification()`
**Sent to:** Admin team (`EMAIL_TO` environment variable)
**Triggered by:** New contact form submission
**Purpose:** Notify team of new quote request with full details

**Variables:**
- `name` - Customer's full name
- `email` - Customer's email address
- `service` - Service requested
- `deadline` - Project deadline
- `message` - Customer's message/details
- `quoteId` - Unique quote identifier

**Example Usage:**
```typescript
import { createAdminNotification } from '@/lib/email';

const emailContent = createAdminNotification({
  name: 'John Smith',
  email: 'john@example.com',
  service: 'Dissertation Editing',
  deadline: '2025-11-15',
  message: 'I need help with my dissertation...',
  quoteId: 'Q-2025-10-001'
});

// emailContent contains { text: '...', html: '...' }
```

### 2. User Confirmation Email

**Function:** `createUserConfirmation()`
**Sent to:** Customer (form submitter)
**Triggered by:** Successful contact form submission
**Purpose:** Confirm receipt and set response expectations

**Variables:**
- `name` - Customer's first name or full name
- `service` - Service requested
- `deadline` - Project deadline
- `message` - Customer's original message (quoted back)
- `quoteId` - Unique quote identifier for reference

**Example Usage:**
```typescript
import { createUserConfirmation } from '@/lib/email';

const emailContent = createUserConfirmation({
  name: 'John',
  service: 'Dissertation Editing',
  deadline: '2025-11-15',
  message: 'I need help with my dissertation...',
  quoteId: 'Q-2025-10-001'
});
```

## Editing Templates

### Step 1: Locate the Template

Open `src/lib/email.ts` and find the template function you want to edit:
- Admin notification: Search for `createAdminNotification`
- User confirmation: Search for `createUserConfirmation`

### Step 2: Edit Both Versions

Each template has TWO versions that must be kept in sync:

#### Plain Text Version
```typescript
const text = `Subject Line

Body content with ${data.variable} interpolation...
`;
```

**Guidelines:**
- Keep formatting simple
- Use plain ASCII characters
- Include all important information
- Use line breaks for readability

#### HTML Version
```typescript
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Inline CSS required */
  </style>
</head>
<body>
  <div class="container">
    ${data.variable}
  </div>
</body>
</html>
`;
```

**Guidelines:**
- Use inline CSS (external stylesheets don't work in email)
- Test in multiple email clients
- Follow the design system (see below)
- Include fallback styles for Outlook

### Step 3: Test Your Changes

```bash
# Send test emails
pnpm test:sendgrid

# Check TypeScript types
pnpm typecheck

# Run all validations
pnpm check
```

### Step 4: Commit

```bash
git add src/lib/email.ts
git commit -m "feat(email): update [template name] template"
```

## Design System

### Colors

Use hex codes for maximum email client compatibility:

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Blue | `#1e3a8a` | Headers, emphasis, links |
| Warning Yellow | `#f59e0b` | Quote ID badges, alerts |
| Light Gray | `#f8f9fa` | Backgrounds, subtle sections |
| Dark Gray | `#333333` | Body text |
| Border Gray | `#dee2e6` | Borders, dividers |
| White | `#ffffff` | Cards, containers |

### Typography

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
line-height: 1.6;
font-size: 16px; /* Use pixels, not rem/em */
```

### Layout

```css
max-width: 600px;  /* Optimal for email clients */
padding: 20px;     /* Mobile-safe minimum */
border-radius: 8px; /* Modern look */
```

### Common Patterns

#### Header Section
```html
<div class="header" style="background: #1e3a8a; color: white; padding: 30px; text-align: center;">
  <h1 style="margin: 0; font-size: 24px;">Header Text</h1>
</div>
```

#### Quote ID Badge
```html
<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
  <strong>Quote ID:</strong> {{quoteId}}
</div>
```

#### Content Section
```html
<div class="content" style="padding: 30px; background: white;">
  <p>Content here...</p>
</div>
```

#### Footer
```html
<div style="padding: 20px; background: #f8f9fa; text-align: center; font-size: 12px; color: #6c757d;">
  Footer content
</div>
```

## Email Client Compatibility

### Testing Checklist

Before deploying template changes, test in:

- [ ] Gmail (web)
- [ ] Gmail (mobile app)
- [ ] Outlook (web)
- [ ] Outlook (desktop)
- [ ] Apple Mail (macOS)
- [ ] Apple Mail (iOS)
- [ ] Thunderbird

### Common Issues

**Outlook Desktop:**
- Uses Word rendering engine (poor CSS support)
- Wrap tables in conditional comments
- Use `mso-` prefixed CSS properties

**Gmail:**
- Strips `<style>` blocks from `<head>`
- Use inline styles exclusively
- Removes `margin` on body, use padding instead

**Mobile Clients:**
- Text too small: Use minimum 14px font size
- Touch targets: Buttons should be at least 44x44px
- Viewport: Always include viewport meta tag

## Adding New Templates

### 1. Define the Function

```typescript
/**
 * TEMPLATE: Your Template Name
 *
 * Sent to: [Recipient]
 * Trigger: [When it's sent]
 * Purpose: [Why it exists]
 *
 * Available Variables:
 * - variable1: Description
 * - variable2: Description
 */
export function createYourTemplate(data: {
  variable1: string;
  variable2: string;
}): { text: string; html: string } {
  // Implementation
}
```

### 2. Implement Text Version

```typescript
const text = `Your Text Template

Variable 1: ${data.variable1}
Variable 2: ${data.variable2}

Footer content`;
```

### 3. Implement HTML Version

```typescript
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Your styles */
  </style>
</head>
<body>
  <div class="container">
    <!-- Your content -->
  </div>
</body>
</html>`;
```

### 4. Return Both Versions

```typescript
return { text, html };
```

### 5. Export the Function

Make sure your function is exported so it can be used by the email service.

### 6. Update Integration Points

If needed, update:
- `functions/api/contact.ts` - Contact API
- `workers/queue-consumer/src/worker.ts` - Queue consumer
- Environment variables documentation

## Environment Variables

Email templates use these environment variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `SENDGRID_API_KEY` | SendGrid authentication | `SG.xxxxx` |
| `EMAIL_FROM` | Sender address | `noreply@liteckyeditingservices.com` |
| `EMAIL_TO` | Admin notification recipient | `hello@liteckyeditingservices.com` |
| `SENDGRID_FORCE_SEND` | Force send in dev mode | `true` |

See `ENVIRONMENT.md` for complete environment variable documentation.

## Integration Points

### Contact Form API

**Location:** `functions/api/contact.ts`

Currently uses simple inline templates. To use the template functions:

```typescript
import { createAdminNotification, createUserConfirmation } from '@/lib/email';

// Inside the handler:
const adminEmail = createAdminNotification({
  name: data.name,
  email: data.email,
  service: data.service || 'Not specified',
  deadline: data.deadline || 'Not specified',
  message: data.message || '',
  quoteId: generateQuoteId()
});

// Use adminEmail.text and adminEmail.html in SendGrid payload
```

### Queue Consumer

**Location:** `workers/queue-consumer/src/worker.ts`

Similar to contact API, can be updated to use template functions instead of inline templates.

## Best Practices

### Content

- ✅ Clear subject lines that indicate purpose
- ✅ Personalize with recipient name when available
- ✅ Include all critical information in plain text version
- ✅ Use clear calls-to-action
- ✅ Include unsubscribe/contact information in footer
- ❌ Don't use marketing language in transactional emails
- ❌ Don't include too many images (spam filters)
- ❌ Don't use shortened URLs (looks suspicious)

### Accessibility

- ✅ Use semantic HTML (`<h1>`, `<p>`, etc.)
- ✅ Provide alt text for images
- ✅ Use sufficient color contrast (WCAG AA minimum)
- ✅ Make links descriptive ("View Quote" not "click here")
- ❌ Don't rely solely on color to convey information
- ❌ Don't use background images for critical content

### Performance

- ✅ Keep HTML under 102KB (Gmail clipping limit)
- ✅ Inline CSS to reduce file size
- ✅ Optimize images and use appropriate formats
- ✅ Test email load time
- ❌ Don't embed large images (use hosted images)
- ❌ Don't include external scripts (security risk)

## Troubleshooting

### Email Not Sending

1. Check environment variables are set
2. Verify SendGrid API key is valid
3. Check sender email is verified in SendGrid
4. Review SendGrid activity logs
5. Check CloudFlare Functions logs

### Rendering Issues

1. Test in multiple email clients
2. Validate HTML with email testing tools
3. Check for unclosed tags or invalid HTML
4. Verify inline styles are applied
5. Test with Litmus or Email on Acid

### Variable Not Substituting

1. Check variable name matches exactly
2. Verify data is passed to template function
3. Check for TypeScript type errors
4. Ensure variable is in template string

## Related Documentation

- `src/lib/email.ts` - Email service and templates (source code)
- `ENVIRONMENT.md` - Environment variable reference
- `TESTING.md` - Testing guidelines
- `functions/api/contact.ts` - Contact form API integration
- `workers/queue-consumer/src/worker.ts` - Queue consumer integration

## Support

For questions or issues with email templates:

1. Check this documentation first
2. Review SendGrid documentation
3. Test with `pnpm test:sendgrid`
4. Check CloudFlare Functions logs
5. Review git history for template changes
