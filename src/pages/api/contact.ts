import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const service = formData.get('service')?.toString();
    const deadline = formData.get('deadline')?.toString();
    const message = formData.get('message')?.toString() || '';

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
    // 4. Verify Turnstile token

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