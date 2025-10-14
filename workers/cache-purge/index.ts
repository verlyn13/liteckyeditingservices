/**
 * Cloudflare Worker for Cache Purging
 * Provides a secure API endpoint for granular cache invalidation
 * Part of the Phase 2 caching strategy for production performance
 */

export interface Env {
	CLOUDFLARE_API_TOKEN: string;
	CLOUDFLARE_ZONE_ID: string;
	PURGE_SECRET: string; // Shared secret with GitHub Actions
}

interface PurgeRequest {
	type: "urls" | "prefixes" | "tags" | "everything";
	items?: string[];
	secret: string;
}

interface PurgeResponse {
	success: boolean;
	message: string;
	purged?: number;
	errors?: string[];
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Only accept POST requests
		if (request.method !== "POST") {
			return new Response("Method not allowed", { status: 405 });
		}

		// Parse request body
		let body: PurgeRequest;
		try {
			body = (await request.json()) as PurgeRequest;
		} catch (error) {
			return Response.json(
				{
					success: false,
					message: "Invalid JSON body",
				} satisfies PurgeResponse,
				{ status: 400 },
			);
		}

		// Validate secret
		if (body.secret !== env.PURGE_SECRET) {
			return Response.json(
				{ success: false, message: "Unauthorized" } satisfies PurgeResponse,
				{
					status: 401,
				},
			);
		}

		// Build the Cloudflare API request
		const apiUrl = `https://api.cloudflare.com/client/v4/zones/${env.CLOUDFLARE_ZONE_ID}/purge_cache`;
		const apiHeaders = {
			Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
			"Content-Type": "application/json",
		};

		let apiBody: Record<string, unknown>;
		switch (body.type) {
			case "everything":
				apiBody = { purge_everything: true };
				break;

			case "urls": {
				if (!body.items?.length) {
					return Response.json(
						{
							success: false,
							message: "No URLs provided",
						} satisfies PurgeResponse,
						{ status: 400 },
					);
				}
				// Transform relative paths to absolute URLs
				const urls = body.items.map((item) => {
					if (item.startsWith("http")) return item;
					const path = item.startsWith("/") ? item : `/${item}`;
					return `https://liteckyeditingservices.com${path}`;
				});
				apiBody = { files: urls };
				break;
			}

			case "prefixes": {
				if (!body.items?.length) {
					return Response.json(
						{
							success: false,
							message: "No prefixes provided",
						} satisfies PurgeResponse,
						{ status: 400 },
					);
				}
				// Ensure prefixes are properly formatted
				const prefixes = body.items.map((item) => {
					if (item.startsWith("http")) return item;
					const path = item.startsWith("/") ? item : `/${item}`;
					return `liteckyeditingservices.com${path}`;
				});
				apiBody = { prefixes };
				break;
			}

			case "tags":
				if (!body.items?.length) {
					return Response.json(
						{
							success: false,
							message: "No tags provided",
						} satisfies PurgeResponse,
						{ status: 400 },
					);
				}
				apiBody = { tags: body.items };
				break;

			default:
				return Response.json(
					{
						success: false,
						message: "Invalid purge type",
					} satisfies PurgeResponse,
					{ status: 400 },
				);
		}

		// Make the API call to Cloudflare
		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: apiHeaders,
				body: JSON.stringify(apiBody),
			});

			const result = (await response.json()) as any;

			if (result.success) {
				// Log successful purge for monitoring
				console.log(`Cache purge successful: ${body.type}`, {
					type: body.type,
					items: body.items?.length || 0,
					timestamp: new Date().toISOString(),
				});

				return Response.json(
					{
						success: true,
						message: `Successfully purged cache (${body.type})`,
						purged: body.items?.length || 1,
					} satisfies PurgeResponse,
					{ status: 200 },
				);
			} else {
				console.error("Cloudflare API error:", result);
				return Response.json(
					{
						success: false,
						message: "Cloudflare API error",
						errors: result.errors?.map((e: any) => e.message) || [
							"Unknown error",
						],
					} satisfies PurgeResponse,
					{ status: 500 },
				);
			}
		} catch (error) {
			console.error("Cache purge failed:", error);
			return Response.json(
				{
					success: false,
					message: "Internal server error",
					errors: [(error as Error).message],
				} satisfies PurgeResponse,
				{ status: 500 },
			);
		}
	},
};
