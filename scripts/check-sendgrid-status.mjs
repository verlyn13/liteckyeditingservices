#!/usr/bin/env node

import fs from "node:fs";
import https from "node:https";

// Read API key from .dev.vars
let apiKey = "";
try {
	const content = fs.readFileSync(".dev.vars", "utf8");
	const match = content.match(/^SENDGRID_API_KEY=(.+)$/m);
	if (match) {
		apiKey = match[1].trim();
	}
} catch (err) {
	console.error("Error reading .dev.vars:", err.message);
	process.exit(1);
}

if (!apiKey) {
	console.error("SENDGRID_API_KEY not found in .dev.vars");
	process.exit(1);
}

console.log("🔍 Checking SendGrid Email Activity...");
console.log("=".repeat(60));
console.log("");

// Check recent email activity
const options = {
	hostname: "api.sendgrid.com",
	port: 443,
	path: "/v3/messages?limit=10",
	method: "GET",
	headers: {
		Authorization: `Bearer ${apiKey}`,
		"Content-Type": "application/json",
	},
};

const req = https.request(options, (res) => {
	let data = "";

	res.on("data", (chunk) => {
		data += chunk;
	});

	res.on("end", () => {
		try {
			const result = JSON.parse(data);

			if (res.statusCode === 200) {
				if (result.messages && result.messages.length > 0) {
					console.log(`Found ${result.messages.length} recent messages:\n`);

					result.messages.forEach((msg, index) => {
						console.log(`${index + 1}. Message ID: ${msg.msg_id}`);
						console.log(`   From: ${msg.from_email}`);
						console.log(`   To: ${msg.to_email}`);
						console.log(`   Subject: ${msg.subject}`);
						console.log(`   Status: ${msg.status}`);
						console.log(
							`   Time: ${new Date(msg.last_event_time * 1000).toLocaleString()}`,
						);

						if (msg.opens_count) console.log(`   Opens: ${msg.opens_count}`);
						if (msg.clicks_count) console.log(`   Clicks: ${msg.clicks_count}`);

						console.log("");
					});
				} else {
					console.log("No recent messages found.");
					console.log("");
					console.log("Possible reasons:");
					console.log("1. Emails may still be processing");
					console.log("2. Email Activity Feed may need to be enabled");
					console.log(
						"3. Messages might be in sandbox mode (not actually sent)",
					);
				}
			} else if (res.statusCode === 401) {
				console.error("❌ Authentication failed. Check your API key.");
			} else if (res.statusCode === 403) {
				console.log("⚠️  Email Activity API requires additional setup:");
				console.log("");
				console.log("1. Go to SendGrid Dashboard → Settings → Mail Settings");
				console.log('2. Find "Email Activity" and turn it ON');
				console.log("3. Wait a few minutes for it to activate");
				console.log("");
				console.log(
					"Alternative: Check Activity Feed in SendGrid Dashboard directly",
				);
				console.log("https://app.sendgrid.com/email_activity");
			} else {
				console.log("API Response:", res.statusCode);
				console.log("Response:", result);
			}
		} catch (error) {
			console.error("Error parsing response:", error.message);
			console.log("Raw response:", data);
		}
	});
});

req.on("error", (error) => {
	console.error("Request error:", error.message);
});

req.end();

// Also check suppressions (bounces, blocks, etc.)
console.log("\n📊 Checking Suppressions...\n");

const suppressionTypes = [
	"bounces",
	"blocks",
	"spam_reports",
	"invalid_emails",
];

suppressionTypes.forEach((type) => {
	const suppOptions = {
		hostname: "api.sendgrid.com",
		port: 443,
		path: `/v3/suppression/${type}?limit=5`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
	};

	https.get(suppOptions, (res) => {
		let data = "";
		res.on("data", (chunk) => {
			data += chunk;
		});
		res.on("end", () => {
			try {
				const result = JSON.parse(data);
				if (result.length > 0) {
					console.log(`⚠️  ${type}: ${result.length} entries`);
					result.forEach((item) => {
						console.log(
							`   - ${item.email} (${new Date(item.created * 1000).toLocaleDateString()})`,
						);
					});
				} else {
					console.log(`✅ ${type}: None`);
				}
			} catch (_e) {
				// Silent fail for suppressions
			}
		});
	});
});
