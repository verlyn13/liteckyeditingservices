import { defineCollection, z } from "astro:content";

// Generic pages: site-managed Markdown content with optional SEO
const pages = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		seo: z
			.object({
				metaTitle: z.string().optional(),
				metaDescription: z.string().optional(),
				noindex: z.boolean().optional(),
			})
			.optional(),
	}),
});

// Site pages: JSON-based unique pages (homepage, about, process)
const sitePages = defineCollection({
	type: "data",
	schema: z.union([
		// Homepage schema
		z.object({
			hero: z.object({
				title: z.string(),
				subtitle: z.string(),
				primaryCta: z.object({
					label: z.string(),
					href: z.string(),
				}),
				secondaryCta: z.object({
					label: z.string(),
					href: z.string(),
				}),
				statsBadge: z.object({
					primary: z.string(),
					secondary: z.string(),
				}),
			}),
			trustBar: z.object({
				tagline: z.string(),
				logos: z
					.array(
						z.object({
							src: z.string(),
							alt: z.string(),
						}),
					)
					.default([]),
			}),
			processSnapshot: z.object({
				steps: z.array(
					z.object({
						title: z.string(),
						body: z.string(),
					}),
				),
			}),
			featuredTestimonial: z.object({
				quote: z.string(),
				author: z.string(),
				role: z.string(),
			}),
		}),
		// About page schema
		z.object({
			title: z.string(),
			description: z.string(),
			headline: z.string(),
			intro: z.string(),
			founder: z
				.object({
					name: z.string(),
					credentials: z.string(),
					years: z.string(),
				})
				.optional(),
			expertise: z.array(z.string()).default([]),
		}),
		// Process page schema
		z.object({
			title: z.string(),
			description: z.string(),
			headline: z.string(),
			intro: z.string(),
			steps: z.array(
				z.object({
					title: z.string(),
					description: z.string(),
					detail: z.string(),
					icon: z.string().optional(),
				}),
			),
		}),
	]),
});

// Settings: JSON-based site configuration
const settings = defineCollection({
	type: "data",
	schema: z.union([
		// General settings schema
		z.object({
			siteTitle: z.string(),
			siteDescription: z.string(),
			contactEmail: z.string(),
			phone: z.string().optional(),
			social: z
				.object({
					twitter: z.string().optional(),
					linkedin: z.string().optional(),
					facebook: z.string().optional(),
				})
				.optional(),
		}),
		// Navigation settings schema
		z.object({
			headerNav: z.array(
				z.object({
					label: z.string(),
					href: z.string(),
					order: z.number(),
				}),
			),
			footerNav: z.object({
				services: z.array(
					z.object({
						label: z.string(),
						href: z.string(),
					}),
				),
				company: z.array(
					z.object({
						label: z.string(),
						href: z.string(),
					}),
				),
				legal: z.array(
					z.object({
						label: z.string(),
						href: z.string(),
					}),
				),
			}),
		}),
	]),
});

// Services: offerings with features and ordering
const services = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		price: z.string().optional(),
		features: z.array(z.string()).default([]),
		order: z.number().default(0),
	}),
});

// Testimonials: social proof entries
const testimonials = defineCollection({
	type: "content",
	schema: z.object({
		quote: z.string(),
		author: z.string(),
		role: z.string().optional(),
		university: z.string().optional(),
		rating: z.number().min(1).max(5).default(5),
		featured: z.boolean().default(false),
		date: z.date(),
	}),
});

// FAQ: question & answer entries
const faq = defineCollection({
	type: "content",
	schema: z.object({
		question: z.string(),
		answer: z.string(),
		category: z
			.enum(["General", "Services", "Process", "Pricing", "Security"])
			.default("General"),
		order: z.number().default(0),
	}),
});

export const collections = {
	pages,
	sitePages,
	settings,
	services,
	testimonials,
	faq,
};
