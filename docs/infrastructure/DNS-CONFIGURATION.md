# DNS Configuration — liteckyeditingservices.com

Last Updated: 2025-10-05

## Overview
- Registrar: (Cloudflare-managed DNS)
- Hosting: Cloudflare Pages (Git-connected project: `liteckyeditingservices`)

## Production Domains
- Apex: `liteckyeditingservices.com`
- WWW: `www.liteckyeditingservices.com`

## Expected Records (Cloudflare DNS)
- WWW: `CNAME www → liteckyeditingservices.pages.dev` (Proxied)
- Apex: `CNAME @ → liteckyeditingservices.pages.dev` (Proxied, CNAME flattening)

## Email (Reference)
- MX (Google Workspace)
  - `1 ASPMX.L.GOOGLE.COM.`
  - `5 ALT1.ASPMX.L.GOOGLE.COM.`
  - `5 ALT2.ASPMX.L.GOOGLE.COM.`
  - `10 ALT3.ASPMX.L.GOOGLE.COM.`
  - `10 ALT4.ASPMX.L.GOOGLE.COM.`
- SPF (TXT)
  - `v=spf1 include:_spf.google.com include:sendgrid.net ~all`
- DKIM (SendGrid) — 2 CNAMEs (example; confirm in SendGrid UI)
  - `s1._domainkey → s1.domainkey.uXXXX.wl.sendgrid.net`
  - `s2._domainkey → s2.domainkey.uXXXX.wl.sendgrid.net`
- DMARC (TXT)
  - `_dmarc → v=DMARC1; p=quarantine; rua=mailto:dmarc@liteckyeditingservices.com`

## Verification Commands
- CNAMEs
  - `dig +short www.liteckyeditingservices.com CNAME`
  - `dig +short liteckyeditingservices.com CNAME`
- SSL
  - `curl -Iv https://www.liteckyeditingservices.com | sed -n '1,20p'`
- Headers
  - `curl -sI https://www.liteckyeditingservices.com | grep -i 'strict-transport-security\|content-security-policy\|x-frame-options'`
- Admin
  - `curl -s https://www.liteckyeditingservices.com/_assets/index.astro_astro_type_script_index_0_lang.*.js | grep 3.8.4`

## Notes
- Cloudflare proxy should remain enabled on both apex and www.
- CNAME flattening allows apex CNAME → pages.dev.
- Confirm actual SendGrid DKIM hostnames in SendGrid’s domain authentication.

