/**
 * Debug script for OAuth postMessage flow
 * Logs all postMessage events to console for troubleshooting
 */
window.addEventListener(
	"message",
	(event) => {
		console.log("[Admin Debug] postMessage received:", {
			origin: event.origin,
			data: event.data,
			dataType: typeof event.data,
			dataPreview:
				typeof event.data === "string"
					? event.data.substring(0, 100)
					: JSON.stringify(event.data).substring(0, 100),
		});

		// Send ACK to OAuth popup for authorization messages
		const dataStr = typeof event.data === "string" ? event.data : "";
		if (dataStr.startsWith("authorization:github:success:")) {
			try {
				console.log("[Admin Debug] Sending ACK to popup");
				event.source?.postMessage?.("authorization:ack", event.origin);
			} catch (e) {
				console.error("[Admin Debug] Error sending ACK:", e);
			}
		}
	},
	false,
);

console.log("[Admin Debug] Listener installed, waiting for OAuth messages...");
