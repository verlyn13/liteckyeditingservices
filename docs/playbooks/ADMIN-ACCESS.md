# Cloudflare Access for /admin/\*

Protect the Decap CMS admin route with Cloudflare Access to restrict who can open the login screen.

## Policy

- Application: `liteckyeditingservices-admin`
- Domain: `www.liteckyeditingservices.com`
- Path: `/admin/*`
- Rules: Allow email domain `@liteckyeditingservices.com` (and any specific editors)
- Session duration: 24h (recommended)

## Steps (Dashboard)

1. Cloudflare → Zero Trust → Access → Applications → Add an application
2. Type: Self-hosted
3. Name: `liteckyeditingservices-admin`
4. Session duration: 24 hours
5. Policies → Add a policy
   - Policy name: `allow-editor-domain`
   - Action: Allow
   - Include: Emails ending in `@liteckyeditingservices.com`
6. Assign the application to your zone and deploy.

## Verify

- Anonymous users should see Access challenge for `/admin/*`
- Approved users proceed to the admin shell and Decap login

## Notes

- Access runs before our admin CSP and scripts; no code change required
- Keep `/admin/*` CSP strict as configured in `functions/admin/[[path]].ts`
