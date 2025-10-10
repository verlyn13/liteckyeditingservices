# Next Steps: Issue Backlog (Oct 4–18, 2025)

Copy items into GitHub issues. Each issue should include Definition of Done (acceptance criteria) and links to evidence (dashboards, reports, PRs).

## Monitoring & Reliability
- [ ] External uptime monitoring (UptimeRobot/Pingdom): 3 locations, 1‑min interval, email alert target.
- [ ] Cloudflare error alerting (Pages + Workers): alerts on 4xx/5xx spikes, Worker exceptions.
- [ ] Queue health: dashboard or daily report with thresholds (size, age).

## Testing & Quality
- [ ] Prod E2E run: Playwright suite against https://liteckyeditingservices.com passes.
- [ ] Visual regression: baseline screenshots and threshold; CI wiring.
- [ ] Expand failure-state E2E (form validation, Turnstile edge cases).
- [ ] A11y sweep: pa11y for top 7 pages + manual screen reader checks.

## Performance
- [ ] Image optimization: sizes, formats, caching; LCP < 2.5s (mobile 4G) for home/services.
- [ ] Code-splitting review: heavy interactive components.
- [ ] Cloudflare caching/headers tune: static + HTML TTL where safe.
- [ ] Core Web Vitals monitoring (field + lab) configured.

## Security
- [ ] CSP hardening with nonces/hashes; no violations in standard navigation.
- [ ] Headers audit: HSTS, frame-ancestors, X-Content-Type-Options; aim A grade.
- [ ] Dependency updates and audit; `pnpm audit` low/no vulnerabilities; green builds.

## SEO & Content
- [ ] Meta descriptions for all pages and Open Graph images.
- [ ] Submit sitemap to Google/Bing; verify indexing without coverage errors.
- [ ] Add 2–3 high‑value content pieces (case study/resources).

## Developer Experience
- [ ] Validate Windsurf Cascade workflows; fix if any fail.
- [ ] Confirm MCP servers available in Windsurf (filesystem, ripgrep, git).
- [ ] Optional: add more MCP servers (web search, OpenAPI) if needed.
