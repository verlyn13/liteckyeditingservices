import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
// Optional CLI: `node scripts/vendor-decap.mjs --version 3.9.4`
const argVersionIndex = process.argv.findIndex((a) => a === "--version");
const overrideVersion = argVersionIndex > -1 ? process.argv[argVersionIndex + 1] : undefined;

const src = path.join(root, "node_modules", "decap-cms", "dist", "decap-cms.js");
const destDir = path.join(root, "public", "vendor", "decap");
const dest = path.join(destDir, "decap-cms.js");

if (!fs.existsSync(src)) {
	console.error(
		"Could not find decap-cms/dist/decap-cms.js. Did you install decap-cms?",
	);
	process.exit(1);
}

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);

// compute a content hash to use as a cache-busting query param
const hash = crypto
	.createHash("sha256")
	.update(fs.readFileSync(dest))
	.digest("hex")
	.slice(0, 16);
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const ver = (overrideVersion || pkg.devDependencies?.["decap-cms"] || "")
  .toString()
  .replace(/^[^\d]*/, "") || "0.0.0";

// write a tiny manifest used by admin/index.html to stamp ?v=
fs.writeFileSync(
	path.join(destDir, "manifest.json"),
	JSON.stringify({ version: ver, hash }, null, 2),
);

console.log(`✅ Vendored decap-cms -> public/vendor/decap/decap-cms.js (v=${ver} hash=${hash})`);
