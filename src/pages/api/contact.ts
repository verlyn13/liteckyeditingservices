import type { APIRoute } from "astro";
import {
	checkRateLimit,
	createAdminNotification,
	createUserConfirmation,
	initSendgrid,
	sendEmail,
	validateContent,
} from "../../lib/email";

// This endpoint must be server-rendered for POST requests
// TODO: Re-enable when we switch to hybrid mode
// export const prerender = false;

// Initialize SendGrid on module load
const sendGridApiKey = import.meta.env.SENDGRID_API_KEY;
if (sendGridApiKey) {
	try {
		initSendgrid(sendGridApiKey);
	} catch (error) {
		console.error("Failed to initialize SendGrid:", error);
	}
}

// Turnstile validation function
async function validateTurnstile(
	token: string,
	remoteip: string | null,
): Promise<{ success: boolean; "error-codes"?: string[] }> {
	// In development, accept test tokens
	if (
		import.meta.env.DEV &&
		(token === "test-token" ||
			token === "2x0000000000000000000000000000000AB" ||
			token === "2x0000000000000000000000000000000AA")
	) {
		console.log("Dev mode: Accepting test token");
		return { success: true };
	}

	const secretKey =
		import.meta.env.TURNSTILE_SECRET_KEY ||
		"2x0000000000000000000000000000000AA"; // Test key fallback

	const formData = new FormData();
	formData.append("secret", secretKey);
	formData.append("response", token);
	if (remoteip) {
		formData.append("remoteip", remoteip);
	}

	try {
		const response = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				body: formData,
			},
		);

		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Turnstile validation error:", error);
		return { success: false, "error-codes": ["internal-error"] };
	}
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
	try {
		// Parse form data
		const formData = await request.formData();
		const name = formData.get("name")?.toString();
		const email = formData.get("email")?.toString();
		const service = formData.get("service")?.toString();
		const deadline = formData.get("deadline")?.toString();
		const message = formData.get("message")?.toString() || "";
		const turnstileToken = formData.get("cf-turnstile-response")?.toString();

		// Get client IP for rate limiting
		const clientIp =
			request.headers.get("CF-Connecting-IP") ||
			request.headers.get("X-Forwarded-For")?.split(",")[0].trim() ||
			clientAddress;

		// Check rate limit by IP (5 requests per 10 minutes)
		const ipRateLimit = checkRateLimit(`ip:${clientIp}`, 5, 600000);
		if (!ipRateLimit.allowed) {
			console.warn(`Rate limit exceeded for IP: ${clientIp}`);
			return new Response(
				JSON.stringify({
					success: false,
					error: "Too many requests. Please try again later.",
					retryAfter: Math.ceil((ipRateLimit.resetAt - Date.now()) / 1000),
				}),
				{
					status: 429,
					headers: {
						"Content-Type": "application/json",
						"Retry-After": String(
							Math.ceil((ipRateLimit.resetAt - Date.now()) / 1000),
						),
					},
				},
			);
		}

		// Validate Turnstile token first
		if (!turnstileToken) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Security verification required",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Validate the Turnstile token
		const turnstileResult = await validateTurnstile(turnstileToken, clientIp);

		if (!turnstileResult.success) {
			console.error(
				"Turnstile validation failed:",
				turnstileResult["error-codes"],
			);
			return new Response(
				JSON.stringify({
					success: false,
					error: "Security verification failed. Please refresh and try again.",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Basic validation
		if (!name || !email || !service || !deadline) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Missing required fields",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Invalid email format",
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Check rate limit by email (2 requests per hour)
		const emailRateLimit = checkRateLimit(
			`email:${email.toLowerCase()}`,
			2,
			3600000,
		);
		if (!emailRateLimit.allowed) {
			console.warn(`Rate limit exceeded for email: ${email}`);
			return new Response(
				JSON.stringify({
					success: false,
					error:
						"Too many submissions from this email. Please try again later.",
					retryAfter: Math.ceil((emailRateLimit.resetAt - Date.now()) / 1000),
				}),
				{
					status: 429,
					headers: {
						"Content-Type": "application/json",
						"Retry-After": String(
							Math.ceil((emailRateLimit.resetAt - Date.now()) / 1000),
						),
					},
				},
			);
		}

		// Validate message content for spam
		const contentValidation = validateContent(message);
		if (!contentValidation.valid) {
			console.warn(
				`Content validation failed: ${contentValidation.reason} for ${email}`,
			);
			return new Response(
				JSON.stringify({
					success: false,
					error: `Invalid submission: ${contentValidation.reason}`,
				}),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		// Generate quote ID
		const quoteId = `QUOTE-${Date.now()}`;

		// Get email configuration
		const emailFrom =
			import.meta.env.EMAIL_FROM || "hello@liteckyeditingservices.com";
		const emailTo =
			import.meta.env.EMAIL_TO || "admin@liteckyeditingservices.com";

		if (!sendGridApiKey) {
			console.error("SendGrid API key not configured");
			// In development, just log and continue
			if (import.meta.env.DEV) {
				console.log("Development mode - Contact form submission:", {
					quoteId,
					name,
					email,
					service,
					deadline,
					message,
					timestamp: new Date().toISOString(),
				});
			} else {
				return new Response(
					JSON.stringify({
						success: false,
						error: "Email service not configured. Please try again later.",
					}),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}
		} else {
			// Prepare form data with quote ID
			const formData = { name, email, service, deadline, message, quoteId };

			// Send admin notification email using em subdomain for better deliverability
			const adminContent = createAdminNotification(formData);
			const adminResult = await sendEmail(
				{
					to: emailTo,
					from: emailFrom,
					subject: `[New Inquiry] ${name} - ${service}`,
					text: adminContent.text,
					html: adminContent.html,
					categories: ["contact_form", "admin_notification", "transactional"],
					customArgs: {
						quoteId,
						source: "web_form",
						service,
						userEmail: email,
					},
					useEmDomain: true, // Use em.liteckyeditingservices.com for transactional emails
				},
				{
					devSandbox:
						import.meta.env.DEV && !import.meta.env.SENDGRID_FORCE_SEND,
					listId: "Contact Form <contact.liteckyeditingservices.com>",
				},
			);

			if (!adminResult.success) {
				console.error("Failed to send admin notification:", adminResult.error);
				if (!import.meta.env.DEV) {
					return new Response(
						JSON.stringify({
							success: false,
							error:
								"Failed to process your submission. Please try again or email us directly.",
						}),
						{ status: 500, headers: { "Content-Type": "application/json" } },
					);
				}
			}

			// Send user confirmation email using em subdomain
			const userContent = createUserConfirmation(formData);
			const userResult = await sendEmail(
				{
					to: email,
					from: emailFrom,
					replyTo: emailFrom, // Replies go to hello@ address
					subject: "Thank you for contacting Litecky Editing Services",
					text: userContent.text,
					html: userContent.html,
					categories: ["contact_form", "user_confirmation", "transactional"],
					customArgs: {
						quoteId,
						source: "web_form",
						service,
					},
					useEmDomain: true, // Use em.liteckyeditingservices.com for transactional emails
				},
				{
					devSandbox:
						import.meta.env.DEV && !import.meta.env.SENDGRID_FORCE_SEND,
					listId: "Contact Form <contact.liteckyeditingservices.com>",
				},
			);

			if (!userResult.success) {
				console.error("Failed to send user confirmation:", userResult.error);
				// Don't fail the entire request if confirmation email fails
			}

			console.log("Contact form processed successfully:", {
				quoteId,
				name,
				email,
				service,
				deadline,
				adminSent: adminResult.success,
				adminMessageId: adminResult.messageId,
				userSent: userResult.success,
				userMessageId: userResult.messageId,
				sandboxMode:
					import.meta.env.DEV && !import.meta.env.SENDGRID_FORCE_SEND,
				timestamp: new Date().toISOString(),
			});
		}

		// TODO: Future enhancements
		// 2. Store inquiry in database with quoteId
		// 3. Handle file uploads to R2

		// Return success response
		return new Response(
			JSON.stringify({
				success: true,
				message: "Thank you for your inquiry. We will respond within 24 hours.",
				quoteId,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-cache, no-store, must-revalidate",
				},
			},
		);
	} catch (error) {
		console.error("Contact form error:", error);
		return new Response(
			JSON.stringify({
				success: false,
				error: "An error occurred processing your request",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
};

// Optionally handle GET requests
export const GET: APIRoute = async () => {
	return new Response(
		JSON.stringify({
			message: "Contact API endpoint - POST requests only",
		}),
		{
			status: 405,
			headers: { "Content-Type": "application/json" },
		},
	);
};
