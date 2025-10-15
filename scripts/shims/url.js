// Browser-compatible URL shim for node:url
export const URL = globalThis.URL;
export const URLSearchParams = globalThis.URLSearchParams;
export const fileURLToPath = (url) => url.toString().replace("file://", "");
export const pathToFileURL = (path) => new URL(`file://${path}`);
export default { URL, URLSearchParams, fileURLToPath, pathToFileURL };
