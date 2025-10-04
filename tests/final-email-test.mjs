#!/usr/bin/env node

console.log("🚀 FINAL EMAIL TEST - With Sandbox Disabled");
console.log("=".repeat(60));
console.log("");

const formData = new FormData();
formData.append("name", "Final Test User");
formData.append("email", "verlyn13+final@gmail.com");
formData.append("service", "Academic Editing");
formData.append("deadline", "2025-11-01");
formData.append(
	"message",
	"Final test with sandbox mode disabled. This email should be delivered to both admin@liteckyeditingservices.com and verlyn13+final@gmail.com",
);
formData.append("cf-turnstile-response", "test-token");

const response = await fetch("http://localhost:4321/api/contact", {
	method: "POST",
	body: formData,
});

const result = await response.json();

if (result.success) {
	console.log("✅ SUCCESS!");
	console.log("Quote ID:", result.quoteId);
	console.log("");
	console.log("📧 Emails should be sent to:");
	console.log("  1. admin@liteckyeditingservices.com (admin notification)");
	console.log("  2. verlyn13+final@gmail.com (user confirmation)");
	console.log("");
	console.log("From address: hello@em.liteckyeditingservices.com");
	console.log("");
	console.log("Check your inbox in 1-2 minutes!");
} else {
	console.log("❌ Failed:", result.error);
}
