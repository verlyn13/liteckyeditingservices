import { defineCollection, z } from 'astro:content';

// Pages: site-managed Markdown content with optional SEO
const pages = defineCollection({
  type: 'content',
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

// Services: offerings with features and ordering
const services = defineCollection({
  type: 'content',
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
  type: 'content',
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
  type: 'content',
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.enum(['General', 'Services', 'Process', 'Pricing', 'Security']).default('General'),
    order: z.number().default(0),
  }),
});

export const collections = { pages, services, testimonials, faq };

