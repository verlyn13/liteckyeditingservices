# Gopass Credential Management

This project uses gopass for secure credential storage and portability across systems.

## Quick Start

### First Time Setup

1. Store all development credentials in gopass:

```bash
./store-dev-vars-in-gopass.sh
```

2. Manually add the SendGrid API key (for security):

```bash
gopass insert development/sendgrid/api-key
# Enter the API key when prompted
```

### On a New System

1. Ensure gopass is installed and configured
2. Generate `.dev.vars` from stored credentials:

```bash
./scripts/generate-dev-vars.sh
```

## Credential Organization

All credentials follow a consistent structure in gopass:

```
development/
├── turnstile/
│   ├── site-key          # Turnstile test site key
│   └── secret-key        # Turnstile test secret key
├── sendgrid/
│   ├── api-key           # SendGrid API key (manual)
│   ├── email-from        # From email address
│   ├── email-to          # To email address
│   └── domain-id         # SendGrid domain ID
└── ...

github/
└── oauth/
    └── litecky-editing/
        ├── client-id     # GitHub OAuth client ID
        └── client-secret # GitHub OAuth client secret
```

## Security Notes

- The SendGrid API key must be stored manually to prevent accidental commits
- All credentials are encrypted with age in gopass
- The `.dev.vars` file is gitignored and should never be committed
- File permissions are set to 600 (owner read/write only)

## Troubleshooting

### Missing Credentials

If `generate-dev-vars.sh` reports missing credentials:

1. Check gopass has the credential:

```bash
gopass show development/sendgrid/api-key
```

2. If missing, add it:

```bash
gopass insert development/sendgrid/api-key
```

### Gopass Sync Issues

If gopass fails to sync with remote:

- Credentials are still stored locally
- Manual sync can be done with: `gopass sync`
- Check remote configuration: `gopass config`

## Related Files

- `store-dev-vars-in-gopass.sh` - Initial credential storage
- `scripts/generate-dev-vars.sh` - Generate .dev.vars from gopass
- `.dev.vars` - Generated environment file (gitignored)
- `ENVIRONMENT.md` - Complete environment variable documentation
