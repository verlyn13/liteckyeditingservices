package infra.cloudflare

# No non-Cloudflare adapters allowed in package.json
deny[msg] {
  input.name == "package.json"
  input.dependencies["@astrojs/vercel"]
  msg := "package.json must not include @astrojs/vercel (Cloudflare deployment only)"
}

deny[msg] {
  input.name == "package.json"
  input.dependencies["@astrojs/netlify"]
  msg := "package.json must not include @astrojs/netlify (Cloudflare deployment only)"
}

# Wrangler TOML must not contain plain secrets
deny[msg] {
  input.name == "wrangler.toml"
  contains(lower(input.raw), "vars")
  contains(lower(input.raw), "secret")
  msg := "wrangler.toml appears to inline secrets under vars (use Worker Secrets)"
}

# No .dev.vars files committed
deny[msg] {
  input.name == "git.files"
  some f
  endswith(input.files[f], ".dev.vars")
  msg := "do not commit .dev.vars; it must be gitignored"
}

# Production env must not include USE_TURNSTILE_TEST
deny[msg] {
  input.name == "env.production"
  some i
  lower(input.vars[i].key) == "use_turnstile_test"
  msg := "USE_TURNSTILE_TEST must not be set in production environment"
}

# Check for required environment variables
deny[msg] {
  input.name == "env.check"
  input.environment == "production"
  required := [
    "PUBLIC_TURNSTILE_SITE_KEY",
    "TURNSTILE_SECRET_KEY",
    "SENDGRID_API_KEY",
    "PUBLIC_SITE_NAME",
    "PUBLIC_SITE_URL"
  ]
  some var in required
  not has_var(var)
  msg := sprintf("Missing required environment variable: %s", [var])
}

# Helper to check if variable exists
has_var(name) {
  some v
  input.vars[v] == name
}