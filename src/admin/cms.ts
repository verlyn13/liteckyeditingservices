// NPM-delivered Decap CMS entry (decap-cms-app)
// Uses explicit CMS.init with config mirroring our dynamic /api/config.yml
// and handles canonical OAuth success to persist + dispatch + navigate.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore decap-cms-app exports CMS
import CMS from 'decap-cms-app';

const origin = window.location.origin;

const config = {
  backend: {
    name: 'github',
    repo: 'verlyn13/liteckyeditingservices',
    branch: 'main',
    base_url: origin,
    auth_endpoint: 'api/auth',
    use_graphql: true,
  },
  site_url: 'https://www.liteckyeditingservices.com',
  media_folder: 'public/uploads',
  public_folder: '/uploads',
  publish_mode: 'editorial_workflow',
  collections: [
    {
      name: 'pages',
      label: '📄 Pages',
      label_singular: 'Page',
      folder: 'src/content/pages',
      create: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{slug}}',
      editor: { preview: false },
      fields: [
        { label: 'Title', name: 'title', widget: 'string', required: true },
        { label: 'Description', name: 'description', widget: 'text', required: false },
        {
          label: 'SEO',
          name: 'seo',
          widget: 'object',
          required: false,
          fields: [
            { label: 'Meta Title', name: 'metaTitle', widget: 'string', required: false },
            { label: 'Meta Description', name: 'metaDescription', widget: 'text', required: false },
            { label: 'No Index', name: 'noindex', widget: 'boolean', default: false, required: false },
          ],
        },
        { label: 'Body', name: 'body', widget: 'markdown', required: true },
      ],
    },
    {
      name: 'services',
      label: '💼 Services',
      label_singular: 'Service',
      folder: 'src/content/services',
      create: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{slug}}',
      sortable_fields: ['order', 'title'],
      editor: { preview: false },
      fields: [
        { label: 'Title', name: 'title', widget: 'string', required: true },
        { label: 'Description', name: 'description', widget: 'text', required: true },
        { label: 'Price', name: 'price', widget: 'string', required: false },
        { label: 'Features', name: 'features', widget: 'list', field: { label: 'Feature', name: 'feature', widget: 'string' }, default: [] },
        { label: 'Order', name: 'order', widget: 'number', default: 0 },
        { label: 'Body', name: 'body', widget: 'markdown', required: true },
      ],
    },
    {
      name: 'testimonials',
      label: '⭐ Testimonials',
      label_singular: 'Testimonial',
      folder: 'src/content/testimonials',
      create: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{year}}-{{month}}-{{author}}',
      summary: '{{author}} - {{university}}',
      sortable_fields: ['date', 'author', 'featured', 'rating'],
      editor: { preview: false },
      fields: [
        { label: 'Quote', name: 'quote', widget: 'text', required: true },
        { label: 'Author', name: 'author', widget: 'string', required: true },
        { label: 'Role', name: 'role', widget: 'string', required: false },
        { label: 'University', name: 'university', widget: 'string', required: false },
        { label: 'Rating', name: 'rating', widget: 'number', default: 5, min: 1, max: 5, value_type: 'int' },
        { label: 'Featured', name: 'featured', widget: 'boolean', default: false },
        { label: 'Date', name: 'date', widget: 'datetime', required: true },
        { label: 'Full Testimonial', name: 'body', widget: 'markdown', required: false },
      ],
    },
    {
      name: 'faq',
      label: '❓ FAQ',
      label_singular: 'FAQ',
      folder: 'src/content/faq',
      create: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{category}}-{{slug}}',
      summary: '{{category}}: {{question}}',
      sortable_fields: ['category', 'order'],
      editor: { preview: false },
      fields: [
        { label: 'Question', name: 'question', widget: 'string', required: true },
        { label: 'Answer', name: 'answer', widget: 'text', required: true },
        { label: 'Category', name: 'category', widget: 'select', options: ['General', 'Services', 'Process', 'Pricing', 'Security'], default: 'General' },
        { label: 'Order', name: 'order', widget: 'number', default: 0 },
        { label: 'Detailed Answer', name: 'body', widget: 'markdown', required: true },
      ],
    },
  ],
};

CMS.init({ config });

// Canonical popup message → persist + dispatch + navigate
window.addEventListener(
  'message',
  (e) => {
    if (e.origin !== window.location.origin) return;
    const s = String(e.data || '');
    if (!s.startsWith('authorization:github:success:')) return;
    try {
      const payload = JSON.parse(s.slice('authorization:github:success:'.length));
      const token = payload?.token as string | undefined;
      if (!token) return;
      const user = { token, backendName: 'github', login: 'github', isGuest: false };
      try { localStorage.setItem('decap-cms-user', JSON.stringify(user)); } catch {}
      try { localStorage.setItem('netlify-cms-user', JSON.stringify(user)); } catch {}
      const store: any = (CMS as any)?.reduxStore || (CMS as any)?.store;
      try { store?.dispatch?.({ type: 'LOGIN_SUCCESS', payload: { token } }); } catch {}
      try { window.location.replace('/admin/#/'); } catch {}
    } catch {
      // ignore
    }
  },
  true,
);

// Diagnostics handle
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).__cmsApp = CMS;

