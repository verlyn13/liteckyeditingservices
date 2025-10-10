// Debug script for OAuth postMessage debugging
console.log("[DEBUG] Setting up postMessage listener...");
window.addEventListener(
	"message",
	(event) => {
		// Log full details of auth-related messages
		if (
			typeof event.data === "string" &&
			event.data.includes("authorization")
		) {
			console.log("[DEBUG] *** AUTH MESSAGE RECEIVED ***", {
				origin: event.origin,
				fullData: event.data,
				type: typeof event.data,
			});
		} else if (
			typeof event.data === "object" &&
			event.data &&
			event.data.type &&
			event.data.type.includes("authorization")
		) {
			console.log("[DEBUG] *** AUTH OBJECT RECEIVED ***", {
				origin: event.origin,
				fullData: JSON.stringify(event.data, null, 2),
				type: typeof event.data,
			});
		}
	},
	false,
);
console.log("[DEBUG] postMessage listener ready");
