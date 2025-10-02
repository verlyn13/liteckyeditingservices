#!/usr/bin/env node

import fs from "node:fs";
import https from "node:https";

// Get API key
const content = fs.readFileSync(".dev.vars", "utf8");
const apiKey = content.match(/^SENDGRID_API_KEY=(.+)$/m)[1].trim();

console.log(
	"📧 Checking SendGrid Activity for admin@liteckyeditingservices.com\n",
);

// Check stats for today
const today = new Date().toISOString().split("T")[0];

const options = {
	hostname: "api.sendgrid.com",
	path: `/v3/stats?start_date=${today}&end_date=${today}`,
	method: "GET",
	headers: {
		Authorization: `Bearer ${apiKey}`,
		"Content-Type": "application/json",
	},
};

https
	.get(options, (res) => {
		let data = "";
		res.on("data", (chunk) => (data += chunk));
		res.on("end", () => {
			try {
				const stats = JSON.parse(data);
				console.log("Today's Statistics:");
				console.log("==================");

				if (stats.length > 0 && stats[0].stats.length > 0) {
					const todayStats = stats[0].stats[0].metrics;
					console.log(`Requests: ${todayStats.requests || 0}`);
					console.log(`Delivered: ${todayStats.delivered || 0}`);
					console.log(`Opens: ${todayStats.opens || 0}`);
					console.log(`Bounces: ${todayStats.bounces || 0}`);
					console.log(`Blocks: ${todayStats.blocks || 0}`);
					console.log(`Spam Reports: ${todayStats.spam_reports || 0}`);
				} else {
					console.log("No stats available yet");
				}
			} catch (_e) {
				console.log("Raw response:", data);
			}
		});
	})
	.on("error", console.error);
