#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const cmsPath = path.join(root, "public", "admin", "cms.js");
const adminHtml = path.join(root, "public", "admin", "index.html");
if (!fs.existsSync(cmsPath)) {
	console.error("[cms-hash] Missing public/admin/cms.js");
	process.exit(1);
}
const buf = fs.readFileSync(cmsPath);
const hash = crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8);
const hashedName = `cms.${hash}.js`;
const hashedPath = path.join(root, "public", "admin", hashedName);
fs.writeFileSync(hashedPath, buf);
console.log("[cms-hash] Wrote", path.relative(root, hashedPath));

// Update admin HTML reference
let html = fs.readFileSync(adminHtml, "utf8");
html = html.replace(
	/\/admin\/cms(?:\.[a-z0-9]+)?\.js/g,
	`/admin/${hashedName}`,
);
// Optionally inject Sentry meta if DSN present and tag missing
const dsn = process.env.PUBLIC_SENTRY_DSN || "";
if (dsn && !/name="sentry-dsn"/i.test(html)) {
	html = html.replace(/<head>([\s\S]*?)<\/head>/i, (m) =>
		m.replace(
			/<head>/i,
			`<head>\n    <meta name="sentry-dsn" content="${dsn}">`,
		),
	);
}
fs.writeFileSync(adminHtml, html);
console.log(
	"[cms-hash] Updated admin/index.html to",
	hashedName,
	dsn ? "(with sentry-dsn meta)" : "",
);

// Ensure headers include immutable cache for hashed file
const headersPath = path.join(root, "public", "_headers");
let headers = fs.existsSync(headersPath)
	? fs.readFileSync(headersPath, "utf8")
	: "";
const rule = `/admin/cms.*.js\n  Cache-Control: public, max-age=31536000, immutable\n`;
if (!headers.includes("/admin/cms.*.js")) {
	headers += (headers.endsWith("\n") ? "" : "\n") + rule;
	fs.writeFileSync(headersPath, headers);
	console.log("[cms-hash] Added immutable cache rule to public/_headers");
}
