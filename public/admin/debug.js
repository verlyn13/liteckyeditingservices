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
	},
	false,
);

console.log("[Admin Debug] Listener installed, waiting for OAuth messages...");
