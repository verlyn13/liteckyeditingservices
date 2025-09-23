import type { APIRoute } from 'astro';

// Turnstile validation function
async function validateTurnstile(token: string, remoteip: string | null): Promise<{ success: boolean; 'error-codes'?: string[] }> {
  const secretKey = import.meta.env.TURNSTILE_SECRET_KEY || '2x0000000000000000000000000000000AA'; // Test key fallback

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (remoteip) {
    formData.append('remoteip', remoteip);
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return { success: false, 'error-codes': ['internal-error'] };
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const service = formData.get('service')?.toString();
    const deadline = formData.get('deadline')?.toString();
    const message = formData.get('message')?.toString() || '';
    const turnstileToken = formData.get('cf-turnstile-response')?.toString();

    // Validate Turnstile token first
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Security verification required',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP
    const remoteip = request.headers.get('CF-Connecting-IP') ||
                     request.headers.get('X-Forwarded-For') ||
                     clientAddress;

    // Validate the Turnstile token
    const turnstileResult = await validateTurnstile(turnstileToken, remoteip);

    if (!turnstileResult.success) {
      console.error('Turnstile validation failed:', turnstileResult['error-codes']);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Security verification failed. Please refresh and try again.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Basic validation
    if (!name || !email || !service || !deadline) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: In production, this would:
    // 1. Send email via SendGrid
    // 2. Store inquiry in database
    // 3. Handle file uploads to R2
    // ✅ 4. Turnstile token verified above

    // For now, log the submission (development only)
    console.log('Contact form submission:', {
      name,
      email,
      service,
      deadline,
      message,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your inquiry. We will respond within 24 hours.',
        quoteId: `QUOTE-${Date.now()}`,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An error occurred processing your request',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Optionally handle GET requests
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      message: 'Contact API endpoint - POST requests only',
    }),
    {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};