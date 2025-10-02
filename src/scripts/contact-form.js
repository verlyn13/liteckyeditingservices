// Progressive enhancement for contact form submission
(() => {
	const form = document.querySelector("[data-contact-form]");
	if (!form) return;
	const status = document.createElement("p");
	status.className = "mt-3 text-sm";
	form.appendChild(status);

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		status.textContent = "Sending...";
		status.classList.remove("text-error");
		try {
			const data = Object.fromEntries(new FormData(form).entries());
			const resp = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.name,
					email: data.email,
					service: data.service,
					message: data.message,
				}),
			});
			if (resp.ok) {
				status.textContent = "Request received. We will reply shortly.";
				status.classList.add("text-text-secondary");
				form.reset();
			} else {
				status.textContent = "There was an error. Please try again later.";
				status.classList.add("text-error");
			}
		} catch (_err) {
			status.textContent = "Network error. Please try again later.";
			status.classList.add("text-error");
		}
	});
})();
