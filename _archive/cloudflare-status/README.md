# Cloudflare Status - Historical Snapshots

**Purpose**: Point-in-time audits of Cloudflare DNS and configuration

## Archived Files

### CLOUDFLARE-STATUS-2025-09-23.md
- **Audit Date**: September 23, 2025 09:49 AKDT
- **Reason for Archive**: Outdated (DNS records have changed)
- **Original location**: `/docs/infrastructure/CLOUDFLARE-STATUS.md`

## How to Generate Current Status

To create a new Cloudflare status report:

```bash
# Using the cloudflare-audit.fish script
./scripts/cloudflare-audit.fish > docs/infrastructure/CLOUDFLARE-STATUS.md

# Or manually export DNS
./scripts/cf-dns-manage.fish list > cloudflare-dns-export.txt
```

## Recommended Schedule

- **Monthly audits**: Archive previous month's status, generate new report
- **After major changes**: DNS updates, new services, domain configuration
- **Before/after migrations**: Capture state for rollback reference

## Archive Naming Convention

Use format: `CLOUDFLARE-STATUS-YYYY-MM-DD.md`

Examples:
- `CLOUDFLARE-STATUS-2025-09-23.md` ← This file
- `CLOUDFLARE-STATUS-2025-10-10.md` ← Next expected archive
- `CLOUDFLARE-STATUS-2025-11-01.md` ← Future monthly audit
