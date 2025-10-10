import type {
	Response as CFResponse,
	PagesFunction,
} from "@cloudflare/workers-types";

// Environment bindings for Cloudflare Pages
interface Env {
	SEND_EMAIL?: {
		send: (msg: unknown) => Promise<void>;
	};
	SENDGRID_API_KEY?: string;
	EMAIL_TO?: string;
	EMAIL_FROM?: string;
}

export const onRequestOptions: PagesFunction<
	Env
> = async (): Promise<CFResponse> => {
	return new Response(null, {
		status: 204,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	}) as unknown as CFResponse;
};

export const onRequestPost: PagesFunction<Env> = async ({
	request,
	env,
}): Promise<CFResponse> => {
	try {
		const contentType = request.headers.get("content-type") || "";
		if (!contentType.includes("application/json")) {
			return json({ error: "Unsupported Media Type" }, 415);
		}
		const data = (await request.json()) as {
			name?: string;
			email?: string;
			service?: string;
			message?: string;
		};

		if (!data?.name || !data?.email) {
			return json({ error: "Missing required fields: name, email" }, 400);
		}

		// If a Queue producer is bound, enqueue an email job
		const queue = env.SEND_EMAIL;
		if (queue && typeof queue.send === "function") {
			await queue.send({ kind: "contact", data });
			return json({ status: "enqueued" }, 202);
		}

		// Otherwise, if SendGrid env vars are present, attempt to send an email directly
		const apiKey = env.SENDGRID_API_KEY;
		const to = env.EMAIL_TO;
		const from = env.EMAIL_FROM;

		if (apiKey && to && from) {
			const payload = {
				personalizations: [
					{
						to: [{ email: to }],
						subject: `New Quote Request from ${data.name}`,
					},
				],
				from: { email: from },
				reply_to: { email: data.email },
				content: [
					{
						type: "text/plain",
						value: `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service ?? "-"}\nMessage: ${data.message ?? "-"}`,
					},
				],
			};

			const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (resp.ok) {
				return json({ status: "sent" }, 202);
			}
			return json(
				{ status: "accepted-no-email", reason: "sendgrid_error" },
				202,
			);
		}

		// Accept without email if SendGrid not configured yet
		return json({ status: "accepted-no-email" }, 202);
	} catch (_err) {
		return json({ error: "Invalid JSON" }, 400);
	}
};

function json(body: unknown, status = 200): CFResponse {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"Access-Control-Allow-Origin": "*",
		},
	}) as unknown as CFResponse;
}
