// Browser shims for Node.js built-in modules used by Decap CMS
// These shims provide minimal browser-compatible implementations

// Process shim
export const process = {
	env: { NODE_ENV: "production" },
	version: "v24.0.0",
	versions: {},
	platform: "browser",
	browser: true,
	argv: [],
	cwd: () => "/",
	nextTick: (fn, ...args) => Promise.resolve().then(() => fn(...args)),
};

// Buffer shim (minimal - Decap may use for base64)
export const Buffer = {
	from: (data, encoding) => {
		if (encoding === "base64") {
			return { toString: (enc) => (enc === "utf8" ? atob(data) : data) };
		}
		return { toString: () => data };
	},
	isBuffer: () => false,
};

// URL shim (use native browser URL)
export const URL = globalThis.URL;
export const URLSearchParams = globalThis.URLSearchParams;

// Path shim (minimal browser-safe implementation)
export const path = {
	join: (...parts) => parts.filter(Boolean).join("/").replace(/\/+/g, "/"),
	dirname: (p) => p.split("/").slice(0, -1).join("/") || "/",
	basename: (p) => p.split("/").pop() || "",
	extname: (p) => {
		const name = p.split("/").pop() || "";
		const idx = name.lastIndexOf(".");
		return idx > 0 ? name.slice(idx) : "";
	},
	resolve: (...parts) =>
		`/${parts.filter(Boolean).join("/").replace(/\/+/g, "/")}`,
};

// Global references
if (typeof globalThis !== "undefined") {
	globalThis.process = globalThis.process || process;
	globalThis.Buffer = globalThis.Buffer || Buffer;
}
