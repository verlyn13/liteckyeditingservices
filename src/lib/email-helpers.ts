/** Email helper utilities (runtime-safe for Workers/Pages). */

/** Map high-level categories to List-Id header values. */
export function getListId(
	category: "booking" | "project" | "billing" | "intake" | string,
): string {
	const map: Record<string, string> = {
		booking: "les-bookings.liteckyeditingservices.com",
		project: "les-projects.liteckyeditingservices.com",
		intake: "les-projects.liteckyeditingservices.com",
		billing: "les-billing.liteckyeditingservices.com",
	};
	return map[category] ?? "les-projects.liteckyeditingservices.com";
}

/**
 * Quiet hours helper.
 * Returns true if local time in the given IANA timezone is outside 08:00–20:00.
 * Non-blocking: use to prefer queueing or to add metadata only.
 */
export function shouldQueueForQuietHours(
	now = new Date(),
	timeZone = "America/Anchorage",
): boolean {
	const fmt = new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: false,
		timeZone,
	});
	const hour = parseInt(fmt.format(now), 10);
	return hour < 8 || hour >= 20;
}

/** Format a date string (ISO) in AKT for human-readable emails. */
export function formatAKT(iso: string) {
	const date = new Date(iso);
	const opts: Intl.DateTimeFormatOptions = {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
		timeZone: "America/Anchorage",
	};
	return new Intl.DateTimeFormat("en-US", opts).format(date);
}
