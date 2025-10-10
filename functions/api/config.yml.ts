/**
 * Cloudflare Pages Function for /api/config.yml
 * Mirrors /admin/config.yml with origin-aware base_url and explicit auth_endpoint
 */

type Env = Record<string, never>;

interface EventContext<Env> {
	request: Request;
	env: Env;
	params: Record<string, string>;
	waitUntil: (promise: Promise<unknown>) => void;
	next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
	data: Record<string, unknown>;
}

type PagesFunction<Env> = (
	context: EventContext<Env>,
) => Response | Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async (context) => {
	const origin = new URL(context.request.url).origin;
	try {
		console.log(
			JSON.stringify({
				evt: "cms_config_emit",
				origin,
				path: "/api/config.yml",
			}),
		);
	} catch {}

	const yaml = `backend:
  name: github
  repo: verlyn13/liteckyeditingservices
  branch: main
  base_url: ${origin}
  auth_endpoint: api/auth

publish_mode: editorial_workflow

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: pages
    label: "📄 Pages"
    label_singular: "Page"
    folder: "src/content/pages"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{slug}}"
    editor:
      preview: false
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Description", name: "description", widget: "text", required: false }
      - label: "SEO"
        name: "seo"
        widget: "object"
        required: false
        fields:
          - { label: "Meta Title", name: "metaTitle", widget: "string", required: false }
          - { label: "Meta Description", name: "metaDescription", widget: "text", required: false }
          - { label: "No Index", name: "noindex", widget: "boolean", default: false, required: false }
      - { label: "Body", name: "body", widget: "markdown", required: true }

  - name: services
    label: "💼 Services"
    label_singular: "Service"
    folder: "src/content/services"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{slug}}"
    sortable_fields: ['order', 'title']
    editor:
      preview: false
    fields:
      - { label: "Title", name: "title", widget: "string", required: true }
      - { label: "Description", name: "description", widget: "text", required: true }
      - { label: "Price", name: "price", widget: "string", required: false }
      - { label: "Features", name: "features", widget: "list", field: { label: "Feature", name: "feature", widget: "string" }, default: [] }
      - { label: "Order", name: "order", widget: "number", default: 0 }
      - { label: "Body", name: "body", widget: "markdown", required: true }

  - name: testimonials
    label: "⭐ Testimonials"
    label_singular: "Testimonial"
    folder: "src/content/testimonials"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{year}}-{{month}}-{{author}}"
    summary: "{{author}} - {{university}}"
    sortable_fields: ['date', 'author', 'featured', 'rating']
    editor:
      preview: false
    fields:
      - { label: "Quote", name: "quote", widget: "text", required: true }
      - { label: "Author", name: "author", widget: "string", required: true }
      - { label: "Role", name: "role", widget: "string", required: false }
      - { label: "University", name: "university", widget: "string", required: false }
      - { label: "Rating", name: "rating", widget: "number", default: 5, min: 1, max: 5, value_type: "int" }
      - { label: "Featured", name: "featured", widget: "boolean", default: false }
      - { label: "Date", name: "date", widget: "datetime", required: true }
      - { label: "Full Testimonial", name: "body", widget: "markdown", required: false }

  - name: faq
    label: "❓ FAQ"
    label_singular: "FAQ"
    folder: "src/content/faq"
    create: true
    extension: "md"
    format: "frontmatter"
    slug: "{{category}}-{{slug}}"
    summary: "{{category}}: {{question}}"
    sortable_fields: ['category', 'order']
    editor:
      preview: false
    fields:
      - { label: "Question", name: "question", widget: "string", required: true }
      - { label: "Answer", name: "answer", widget: "text", required: true }
      - label: "Category"
        name: "category"
        widget: "select"
        options: ["General", "Services", "Process", "Pricing", "Security"]
        default: "General"
      - { label: "Order", name: "order", widget: "number", default: 0 }
      - { label: "Detailed Answer", name: "body", widget: "markdown", required: true }
`;

	return new Response(yaml, {
		headers: {
			"Content-Type": "text/yaml; charset=utf-8",
			"Cache-Control": "no-store",
			"X-Config-Origin": origin,
		},
	});
};
