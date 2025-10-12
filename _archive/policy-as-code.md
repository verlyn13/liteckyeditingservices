# 0) The idea in one line

- **Desired state lives in Git.**
- **Policies (Rego/Conftest) say what “good” means.**
- **CI runs fast guards on every PR + a nightly drift check** against Cloudflare & SendGrid APIs and your own docs/files.
  (Turnstile test keys, secrets practices, Pages/Workers variables, and SendGrid templates referenced below are based on current docs.) ([Cloudflare Docs][1])

---

# 1) Repository layout (policy + desired state)

```
/
├─ policy/                          # all Rego policies for Conftest
│  ├─ code/architecture.rego        # directory & file layout rules
│  ├─ code/quality.rego             # package.json scripts exist, CI scripts present
│  ├─ infra/cloudflare.rego         # wrangler.toml, Pages env rules
│  ├─ cms/decap.rego                # admin/config.yml rules
│  ├─ email/sendgrid.rego           # template ids present, JSON shape
│  └─ docs/docs.rego                # docs presence + ADR rules
├─ desired-state/                   # declarative inventory to diff against real world
│  ├─ cloudflare.pages.json         # expected Pages variables & secrets (names only)
│  ├─ cloudflare.worker-oauth.json  # expected Worker secrets (names only)
│  ├─ sendgrid.templates.json       # expected template ids + names
│  └─ repo.required-files.json      # files that must exist
├─ scripts/
│  ├─ drift/cloudflare-pages.mjs    # lists vars/secrets via Wrangler and diffs
│  ├─ drift/cloudflare-worker.mjs   # lists Worker secrets via Wrangler and diffs
│  ├─ drift/sendgrid-templates.mjs  # calls SendGrid v3 to verify template ids
│  ├─ validate/ajv-validate.mjs     # schema checks for YAML/JSON (Decap, etc.)
│  └─ gates/require-docs.mjs        # fails PR if code-touch without doc/ADR
└─ .github/workflows/
   ├─ quality.yml
   ├─ drift-nightly.yml
   └─ docs-health.yml
```

---

# 2) Policy: what we enforce (Rego rules)

### A) Architecture & repo hygiene (`policy/code/architecture.rego`)

- **Required files** in `repo.required-files.json` must exist (README, RUNBOOK, ARCHITECTURE, SECRETS, ENVIRONMENT, CONTRIBUTING, CODEOWNERS, Renovate config).
- **Directory skeleton** (`src/`, `functions/api/`, `public/admin/`, `policy/`, `docs/`) must exist.
- **No secrets** committed: deny if any files match `*secret*.*`, `.dev.vars*`, or `.env*`. (We still allow CI fixtures.)
- **Turnstile self-test page only in non-prod**: deny if `USE_TURNSTILE_TEST` found in production env files. (Turnstile requires server-side verification & separate test/real keys.) ([Cloudflare Docs][2])

### B) Code quality gates (`policy/code/quality.rego`)

- `package.json` must expose: `check`, `lint:fix`, `test:e2e`, and the exact linters/type-checks we set (Biome/Prettier/ESLint/`tsc`/`astro check`/`sv check`).
- **Playwright** present and config points `testDir: ./tests/e2e`.
- PRs touching `/functions` must include a test added/updated under `tests/e2e/`.

### C) Cloudflare config policy (`policy/infra/cloudflare.rego`)

- `wrangler.toml` for the **OAuth Worker** must **not** set secrets in plaintext `vars`. (Use Worker Secrets only.) ([Cloudflare Docs][3])
- **Pages Functions**: forbid checked-in secrets; require `TURNSTILE_SECRET_KEY`/`SENDGRID_API_KEY` to be bound at runtime (names checked, not values). Docs recommend `.dev.vars` for local dev. ([Cloudflare Docs][4])
- Require **custom domain route** for the OAuth Worker (`cms-auth.<domain>`), with `/auth` and `/callback` available (Decap flow).
- If `USE_TURNSTILE_TEST=1` in any env file, then **test keys** must be set (`TURNSTILE_TEST_SITE_KEY`, `TURNSTILE_TEST_SECRET_KEY`)—matching Turnstile testing guidance. ([Cloudflare Docs][5])

### D) Decap CMS policy (`policy/cms/decap.rego`)

- `public/admin/config.yml` must use `backend: github` with `base_url` at the **root of the OAuth subdomain** (no sub-paths) and a `folder` under `src/content/pages`. (This keeps OAuth clean and editors happy.)

### E) Email policy (`policy/email/sendgrid.rego`)

- `desired-state/sendgrid.templates.json` must list template ids used by the contact function; deny if function references an id not in desired state.
- Encourage **v3 API dynamic templates** (not SMTP/legacy) per SendGrid docs. ([SendGrid][6])

### F) Docs policy (`policy/docs/docs.rego`)

- Any PR that changes `src/**`, `functions/**`, or `wrangler.toml` **must** touch one of: `CHANGELOG.md`, `ARCHITECTURE.md`, or an ADR file.
- If `functions/api/contact.ts` changes, require `docs/playbooks/email-issues.md` update (or allow an override label).

> Conftest/OPA is a perfect fit for these JSON/YAML file assertions. ([Conftest][7])

---

# 3) Validation scripts (fast & agent-friendly)

### 3.1 Conftest (policy-as-code)

Add dev dep and a runner:

```bash
# install (CI will also curl static binary)
brew install conftest || true
conftest test --policy policy .   # runs on everything; we pass specific files in CI
```

(Conftest is the standard for config tests on structured data using OPA/Rego.) ([GitHub][8])

### 3.2 AJV schema checks for YAML/JSON

Use `ajv` to validate `public/admin/config.yml` (after converting to JSON) and your `desired-state/*.json` files:

```js
// scripts/validate/ajv-validate.mjs
import fs from 'node:fs';
import { load } from 'js-yaml';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, strict: false });

const schemas = [
  ['decap-config', 'schemas/decap-config.schema.json', 'public/admin/config.yml'],
  [
    'sendgrid-desired',
    'schemas/sendgrid-templates.schema.json',
    'desired-state/sendgrid.templates.json',
  ],
];

let failed = false;

for (const [name, schemaPath, filePath] of schemas) {
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const raw = fs.readFileSync(filePath, 'utf8');
  const data =
    filePath.endsWith('.yml') || filePath.endsWith('.yaml') ? load(raw) : JSON.parse(raw);
  const validate = ajv.compile(schema);
  const ok = validate(data);
  if (!ok) {
    failed = true;
    console.error(`[${name}] schema errors:\n`, validate.errors);
  }
}

process.exit(failed ? 1 : 0);
```

### 3.3 Drift detectors (compare actual vs desired)

**A) Cloudflare Pages variables & secrets**

Wrangler exposes Pages **secret list**—we can diff that with `desired-state/cloudflare.pages.json`. ([Cloudflare Docs][9])

```js
// scripts/drift/cloudflare-pages.mjs
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const project = process.env.CF_PAGES_PROJECT;
const desired = JSON.parse(fs.readFileSync('desired-state/cloudflare.pages.json', 'utf8'));
// { production: { variables:[], secrets:[] }, preview: { variables:[], secrets:[] } }

function listSecrets(envName) {
  const out = execSync(
    `npx wrangler pages secret list --project-name=${project} --environment=${envName}`,
    { stdio: 'pipe' }
  ).toString();
  // JSON lines or table; parse names robustly:
  const names = [...out.matchAll(/[A-Z0-9_]+/g)]
    .map((m) => m[0])
    .filter((x) => x !== 'NAME' && x !== 'VALUE');
  return new Set(names);
}

function diff(kind, envName, expected) {
  const have = listSecrets(envName);
  const missing = expected.secrets.filter((n) => !have.has(n));
  if (missing.length) {
    console.error(`[drift] ${kind}/${envName} missing secrets: ${missing.join(', ')}`);
    process.exitCode = 1;
  }
}

diff('pages', 'production', desired.production);
diff('pages', 'preview', desired.preview);
```

**B) Cloudflare Worker (OAuth proxy) secrets**

Use **Workers secrets** with `wrangler secret list` (or `versions secret list` in gradual deployments) and diff against `desired-state/cloudflare.worker-oauth.json`. (Secrets should only be visible by name—not value.) ([Cloudflare Docs][10])

**C) SendGrid templates**

Verify the IDs in `desired-state/sendgrid.templates.json` exist by calling `GET /v3/templates` and checking for **dynamic** templates in the set. ([Twilio][11])

```js
// scripts/drift/sendgrid-templates.mjs
import fs from 'node:fs';

const desired = JSON.parse(fs.readFileSync('desired-state/sendgrid.templates.json', 'utf8'));
// { templates: [{id:"d-xxxx", name:"ContactReceived"}, ...] }

const res = await fetch('https://api.sendgrid.com/v3/templates?generations=dynamic', {
  headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}` },
});
if (!res.ok) {
  console.error('SendGrid list failed', await res.text());
  process.exit(1);
}
const body = await res.json();
const ids = new Set((body.templates || []).map((t) => t.id));

const missing = desired.templates.filter((t) => !ids.has(t.id));
if (missing.length) {
  console.error('[drift] Missing SendGrid templates:', missing.map((t) => t.id).join(', '));
  process.exit(1);
}
```

(Transactional Templates API docs & versions are current; dynamic templates are v3-only, not SMTP.) ([Twilio][12])

---

# 4) CI wiring (merge-blocking + nightly drift)

### 4.1 PR quality gate (`.github/workflows/quality.yml`)

- Runs **Conftest**, **AJV**, **linters & type checks**, and **Playwright smoke** (against PR preview URL).
- Protected branch requires these checks to pass (GitHub **required status checks**). ([GitHub Docs][13])

```yaml
name: Quality Gate
on:
  pull_request:
    paths-ignore: ['**/*.md', 'docs/**']
jobs:
  policy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Conftest
        run: |
          curl -sSL https://github.com/open-policy-agent/conftest/releases/latest/download/conftest_Linux_x86_64.tar.gz | tar -xz
          ./conftest test --policy policy public/admin/config.yml wrangler.toml package.json desired-state/**/*.json
      - name: AJV schema checks
        run: node scripts/validate/ajv-validate.mjs

  code:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 'lts/*' }
      - run: npm ci
      - run: npm run check # biome/prettier/eslint/tsc/astro/sv

  e2e:
    runs-on: ubuntu-latest
    env:
      BASE_URL: ${{ steps.preview.outputs.url }}
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/pages-action@v1
        id: preview
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: liteckyeditingservices
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          wranglerVersion: 'latest'
          branch: ${{ github.head_ref }}
          # preview deploy; set test Turnstile vars on this preview:
          # (or preconfigure in Pages Preview environment)
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

> In the repo settings, set **branch protection** on `main` with required checks from this workflow. ([GitHub Docs][13])

### 4.2 Nightly drift check (`.github/workflows/drift-nightly.yml`)

- Calls `scripts/drift/*` to compare **actual Cloudflare/SendGrid** with `desired-state/`.
- Fails the run (emails you via GitHub notifications) if anything diverges.

```yaml
name: Drift Nightly
on:
  schedule: [{ cron: '15 11 * * *' }] # 11:15 UTC daily
  workflow_dispatch:
jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 'lts/*' }
      - run: npm ci || true
      - name: Pages secrets diff
        env:
          CF_PAGES_PROJECT: liteckyeditingservices
        run: node scripts/drift/cloudflare-pages.mjs
      - name: Worker secrets diff
        run: node scripts/drift/cloudflare-worker.mjs
      - name: SendGrid templates diff
        env:
          SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY }}
        run: node scripts/drift/sendgrid-templates.mjs
```

---

# 5) Guardrails in GitHub itself

- **Branch protection**: require passing checks, disallow force-push, require CODEOWNERS review. ([GitHub Docs][14])
- **CODEOWNERS**: assign `@you` for `/`, and also own `.github/`, `policy/`, `functions/**`, `workers/**`.
- **Rules**: only allow squash merges; require signed commits if you like.

---

# 6) Pre-commit (local & agent hooks)

Add `lefthook` (or `pre-commit`) to run the same quick checks locally:

```
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    conftest:
      run: ./conftest test --policy policy public/admin/config.yml wrangler.toml package.json
    lint:
      run: npm run check --silent
```

(Conftest supports pre-commit directly too.) ([Conftest][7])

---

# 7) What “desired state” JSON looks like

**`desired-state/cloudflare.pages.json`**

```json
{
  "production": {
    "variables": ["TURNSTILE_SITE_KEY", "SENDGRID_CONTACT_TEMPLATE_ID"],
    "secrets": ["TURNSTILE_SECRET_KEY", "SENDGRID_API_KEY"]
  },
  "preview": {
    "variables": [
      "TURNSTILE_SITE_KEY",
      "SENDGRID_CONTACT_TEMPLATE_ID",
      "USE_TURNSTILE_TEST",
      "TURNSTILE_TEST_SITE_KEY"
    ],
    "secrets": ["TURNSTILE_SECRET_KEY", "TURNSTILE_TEST_SECRET_KEY", "SENDGRID_API_KEY"]
  }
}
```

**`desired-state/cloudflare.worker-oauth.json`**

```json
{ "secrets": ["GITHUB_OAUTH_ID", "GITHUB_OAUTH_SECRET"] }
```

**`desired-state/sendgrid.templates.json`**

```json
{
  "templates": [
    { "id": "d-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "name": "ContactReceived" },
    { "id": "d-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "name": "ContactConfirmation" }
  ]
}
```

(Template listing/diff uses SendGrid’s **Transactional Templates** v3 endpoints.) ([Twilio][11])

---

# 8) “Docs don’t drift” rule (PR bot)

Two small helpers:

- **Docs gate**: `scripts/gates/require-docs.mjs` fails if code-paths change and none of `CHANGELOG.md`, `ARCHITECTURE.md`, or any `docs/decisions/*.md` is touched.
- **Docs health** Action (weekly) already shared; keep it—broken links/markdown lint catch rot.

---

# 9) Secret handling + tests

- Local dev uses `.dev.vars` (Cloudflare’s recommended way). **Policies forbid committing it.** ([Cloudflare Docs][4])
- Turnstile **test keys** only in Preview/Dev; production never sets `USE_TURNSTILE_TEST`. (Turnstile’s test keys & server-side validation guidance referenced.) ([Cloudflare Docs][5])

---

## TL;DR install list

- **Conftest + Rego** for policy-as-code. ([GitHub][8])
- **AJV** for schema sanity.
- **Wrangler** already present; we use it to **list Pages/Worker secrets** in drift checks. ([Cloudflare Docs][9])
- **SendGrid v3 API** to verify template IDs exist. ([Twilio][11])
- **Branch protection** to make checks required. ([GitHub Docs][13])

[1]: https://developers.cloudflare.com/turnstile/get-started/?utm_source=chatgpt.com 'Get started · Cloudflare Turnstile docs'
[2]: https://developers.cloudflare.com/turnstile/get-started/server-side-validation?utm_source=chatgpt.com 'Server-side validation | Cloudflare Turnstile docs'
[3]: https://developers.cloudflare.com/workers/configuration/environment-variables/?utm_source=chatgpt.com 'Environment variables · Cloudflare Workers docs'
[4]: https://developers.cloudflare.com/pages/functions/bindings/?utm_source=chatgpt.com 'Bindings · Cloudflare Pages docs'
[5]: https://developers.cloudflare.com/turnstile/troubleshooting/testing/?utm_source=chatgpt.com 'Testing · Cloudflare Turnstile docs'
[6]: https://sendgrid.com/en-us/blog/how-to-use-sendgrids-dynamic-templates-for-your-transactional-emails?utm_source=chatgpt.com "How to Use SendGrid's Dynamic Templates for Your Transactional Emails | SendGrid"
[7]: https://www.conftest.dev/?utm_source=chatgpt.com 'Conftest'
[8]: https://github.com/open-policy-agent/conftest?utm_source=chatgpt.com 'GitHub - open-policy-agent/conftest: Write tests against structured configuration data using the Open Policy Agent Rego query language'
[9]: https://developers.cloudflare.com/workers/wrangler/commands?utm_source=chatgpt.com 'Commands - Wrangler'
[10]: https://developers.cloudflare.com/workers/configuration/secrets?utm_source=chatgpt.com 'Secrets | Cloudflare Workers docs'
[11]: https://www.twilio.com/docs/sendgrid/api-reference/transactional-templates/retrieve-paged-transactional-templates?utm_source=chatgpt.com 'Retrieve paged transactional templates. | SendGrid Docs | Twilio'
[12]: https://www.twilio.com/docs/sendgrid/api-reference/transactional-templates?utm_source=chatgpt.com 'Transactional Templates | SendGrid Docs | Twilio'
[13]: https://docs.github.com/articles/about-required-status-checks?utm_source=chatgpt.com 'About protected branches - GitHub Docs'
[14]: https://docs.github.com/articles/about-codeowners?utm_source=chatgpt.com 'About code owners - GitHub Docs'

---

# 0) How to run (quick)

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "policy:test": "conftest test --policy policy public/admin/config.yml wrangler.toml package.json desired-state/**/*.json",
    "schema:check": "node scripts/validate/ajv-validate.mjs",
    "drift:pages": "node scripts/drift/cloudflare-pages.mjs",
    "drift:worker": "node scripts/drift/cloudflare-worker.mjs",
    "drift:sendgrid": "node scripts/drift/sendgrid-templates.mjs",
    "drift:all": "npm run drift:pages && npm run drift:worker && npm run drift:sendgrid",
    "gate:docs": "node scripts/gates/require-docs.mjs"
  }
}
```

You’ll need:

- **Conftest** installed (or curl the static binary in CI).
- Node 18+ (recommended LTS).
- `wrangler` available in CI for Cloudflare listing.
- `SENDGRID_API_KEY` available in env for the SendGrid drift script.

---

# 1) Rego policies (OPA/Conftest)

## `policy/code/architecture.rego`

```rego
package code.architecture

# Inputs: we’ll run conftest on specific files; for repo-wide checks we accept
# a synthetic list via desired-state/repo.required-files.json

# Deny if required repo files are missing
deny[msg] {
  input.kind == "repo.required"
  some i
  required := input.required[i]
  not file_exists(required)
  msg := sprintf("required file missing: %s", [required])
}

# Helper: pretend existence check via injected list (works with conftest --input)
file_exists(path) {
  some j
  input.present[j] == path
}

# No secrets or env files committed
deny[msg] {
  input.kind == "git.files"
  some f
  pat := regex.match(`(^|/)\.env($|\.|-)`, input.files[f])
  msg := sprintf("forbidden committed file (env): %s", [input.files[f]])
}

deny[msg] {
  input.kind == "git.files"
  some f
  pat := regex.match(`(^|/)\.dev\.vars`, input.files[f])
  msg := sprintf("forbidden committed file (.dev.vars): %s", [input.files[f]])
}

deny[msg] {
  input.kind == "git.files"
  some f
  pat := regex.match(`secret`, lower(input.files[f]))
  msg := sprintf("file name suggests secret committed: %s", [input.files[f]])
}
```

> How to feed `repo.required` and `git.files` inputs is shown in the docs gate script below (we generate an input JSON from `git ls-files`).

---

## `policy/code/quality.rego`

```rego
package code.quality

# Check package.json has expected scripts (when run with: conftest test package.json)
deny[msg] {
  input.name == "package.json"
  not input.scripts.check
  msg := "package.json missing script: check"
}
deny[msg] {
  input.name == "package.json"
  not input.scripts["lint:fix"]
  msg := "package.json missing script: lint:fix"
}
deny[msg] {
  input.name == "package.json"
  not input.scripts["test:e2e"]
  msg := "package.json missing script: test:e2e"
}

# If /functions changed, require e2e tests exist (enforced by docs gate script at PR time).
# This Rego only checks presence of tests directory.
deny[msg] {
  input.name == "project.inventory"
  input.functions_changed == true
  not input.tests_e2e_present
  msg := "changes in /functions require tests in tests/e2e/"
}
```

---

## `policy/infra/cloudflare.rego`

```rego
package infra.cloudflare

# Wrangler TOML must not contain plain 'vars = { ... }' with secrets for Workers.
deny[msg] {
  input.name == "wrangler.toml"
  some k
  lower(input.raw) contains "vars"
  lower(input.raw) contains "secret"
  msg := "wrangler.toml appears to inline secrets under vars (use Worker Secrets)"
}

# Pages/Functions must reference required secret names in desired-state (names only)
# This check is done by drift scripts; here we just ensure no .dev.vars content is committed.
deny[msg] {
  input.name == "git.files"
  some f
  endswith(input.files[f], ".dev.vars")  # double safety
  msg := "do not commit .dev.vars; it must be gitignored"
}

# For Turnstile testing flags: production env files must not include USE_TURNSTILE_TEST
deny[msg] {
  input.name == "env.production"
  some i
  lower(input.vars[i].key) == "use_turnstile_test"
  msg := "USE_TURNSTILE_TEST must not be set in production environment"
}
```

---

## `policy/cms/decap.rego`

```rego
package cms.decap

# Run conftest against public/admin/config.yml converted to JSON (conftest auto-parses YAML)

deny[msg] {
  input.backend.name != "github"
  msg := "Decap backend must be 'github'"
}

deny[msg] {
  not startswith(input.backend.base_url, "https://cms-auth.")
  msg := "Decap backend.base_url must be a dedicated OAuth subdomain at the root"
}

deny[msg] {
  collections := input.collections[_]
  collections.name == "pages"
  not startswith(collections.folder, "src/content/pages")
  msg := "Decap 'pages' collection must map to src/content/pages"
}
```

---

## `policy/email/sendgrid.rego`

```rego
package email.sendgrid

# Validate that template ids referenced in desired-state are well-formed (prefix 'd-')
deny[msg] {
  input.name == "sendgrid.templates.json"
  some t
  tdata := input.templates[t]
  not startswith(tdata.id, "d-")
  msg := sprintf("SendGrid template id invalid (must start with d-): %s", [tdata.id])
}
```

---

## `policy/docs/docs.rego`

```rego
package docs.rules

# PRs that touch code must also touch at least one doc file (ARCHITECTURE, ADRs, or CHANGELOG)
deny[msg] {
  input.name == "pr.changed"
  input.touched_code == true
  not input.touched_docs
  msg := "code changes require doc/ADR or CHANGELOG update"
}
```

---

# 2) JSON Schemas (AJV)

## `schemas/decap-config.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["backend", "collections"],
  "properties": {
    "site_url": { "type": "string", "format": "uri" },
    "backend": {
      "type": "object",
      "required": ["name", "repo", "branch", "base_url"],
      "properties": {
        "name": { "const": "github" },
        "repo": { "type": "string", "pattern": "^[^/]+/[^/]+$" },
        "branch": { "type": "string", "minLength": 1 },
        "base_url": {
          "type": "string",
          "pattern": "^https://cms-auth\\.[a-zA-Z0-9.-]+$"
        }
      },
      "additionalProperties": true
    },
    "collections": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["name", "folder", "fields"],
        "properties": {
          "name": { "type": "string" },
          "folder": { "type": "string" },
          "fields": { "type": "array", "minItems": 1 }
        }
      }
    }
  },
  "additionalProperties": true
}
```

## `schemas/sendgrid-templates.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["templates"],
  "properties": {
    "templates": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "name"],
        "properties": {
          "id": { "type": "string", "pattern": "^d-[a-f0-9]{32}$" },
          "name": { "type": "string", "minLength": 3 }
        }
      }
    }
  }
}
```

---

# 3) Desired state examples (fill with your real values)

## `desired-state/cloudflare.pages.json`

```json
{
  "production": {
    "variables": ["TURNSTILE_SITE_KEY", "SENDGRID_CONTACT_TEMPLATE_ID"],
    "secrets": ["TURNSTILE_SECRET_KEY", "SENDGRID_API_KEY"]
  },
  "preview": {
    "variables": [
      "TURNSTILE_SITE_KEY",
      "SENDGRID_CONTACT_TEMPLATE_ID",
      "USE_TURNSTILE_TEST",
      "TURNSTILE_TEST_SITEKEY"
    ],
    "secrets": ["TURNSTILE_SECRET_KEY", "TURNSTILE_TEST_SECRET_KEY", "SENDGRID_API_KEY"]
  }
}
```

> Note: If you prefer `TURNSTILE_TEST_SITE_KEY` spelling, keep it consistent across env and code.

## `desired-state/cloudflare.worker-oauth.json`

```json
{ "secrets": ["GITHUB_OAUTH_ID", "GITHUB_OAUTH_SECRET"] }
```

## `desired-state/sendgrid.templates.json`

```json
{
  "templates": [
    { "id": "d-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "name": "ContactReceived" },
    { "id": "d-bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "name": "ContactConfirmation" }
  ]
}
```

---

# 4) Drift & validation scripts

## `scripts/drift/cloudflare-pages.mjs`

```js
#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const project = process.env.CF_PAGES_PROJECT || 'liteckyeditingservices'; // change if needed
const desired = JSON.parse(fs.readFileSync('desired-state/cloudflare.pages.json', 'utf8'));

function list(kind, envName) {
  // Wrangler prints a table; we parse NAME column text robustly.
  // secrets
  let out = execSync(
    `npx wrangler pages secret list --project-name=${project} --environment=${envName}`,
    { stdio: 'pipe' }
  ).toString();
  const sec = new Set(
    [...out.matchAll(/\b[A-Z0-9_]{2,}\b/g)]
      .map((m) => m[0])
      .filter((x) => !['NAME', 'VALUE'].includes(x))
  );

  // variables
  out = execSync(
    `npx wrangler pages project settings --project-name=${project} --environment=${envName}`,
    { stdio: 'pipe' }
  ).toString();
  // Attempt to parse JSON first; fallback to scan
  let vars = new Set();
  try {
    const obj = JSON.parse(out);
    const entries = obj?.env_vars || obj?.deployment_configs?.[envName]?.env_vars || {};
    vars = new Set(Object.keys(entries));
  } catch {
    vars = new Set([...out.matchAll(/\b[A-Z0-9_]{2,}\b/g)].map((m) => m[0]));
  }
  return { vars, sec };
}

function diffEnv(envName, expected) {
  const { vars, sec } = list('pages', envName);

  const missVars = (expected.variables || []).filter((n) => !vars.has(n));
  const missSec = (expected.secrets || []).filter((n) => !sec.has(n));

  if (missVars.length) {
    console.error(`[drift] Pages/${envName} missing VARIABLES: ${missVars.join(', ')}`);
    process.exitCode = 1;
  }
  if (missSec.length) {
    console.error(`[drift] Pages/${envName} missing SECRETS: ${missSec.join(', ')}`);
    process.exitCode = 1;
  }
}

diffEnv('production', desired.production || {});
diffEnv('preview', desired.preview || {});
if (process.exitCode) process.exit(process.exitCode);
console.log('Pages drift: OK');
```

---

## `scripts/drift/cloudflare-worker.mjs`

```js
#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const workerName = process.env.CF_WORKER_NAME || 'decap-oauth';
const desired = JSON.parse(fs.readFileSync('desired-state/cloudflare.worker-oauth.json', 'utf8'));

function listWorkerSecrets() {
  const out = execSync(`npx wrangler secret list --name ${workerName}`, {
    stdio: 'pipe',
  }).toString();
  // Parse NAME column
  const names = new Set(
    [...out.matchAll(/\b[A-Z0-9_]{2,}\b/g)]
      .map((m) => m[0])
      .filter((x) => !['NAME', 'VALUE'].includes(x))
  );
  return names;
}

const have = listWorkerSecrets();
const expected = new Set(desired.secrets || []);
const missing = [...expected].filter((x) => !have.has(x));
if (missing.length) {
  console.error(`[drift] Worker ${workerName} missing secrets: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('Worker drift: OK');
```

---

## `scripts/drift/sendgrid-templates.mjs`

```js
#!/usr/bin/env node
import fs from 'node:fs';

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('SENDGRID_API_KEY not set');
  process.exit(1);
}

const desired = JSON.parse(fs.readFileSync('desired-state/sendgrid.templates.json', 'utf8'));
const want = new Set((desired.templates || []).map((t) => t.id));

const res = await fetch('https://api.sendgrid.com/v3/templates?generations=dynamic', {
  headers: { Authorization: `Bearer ${apiKey}` },
});
if (!res.ok) {
  console.error('[drift] SendGrid list failed:', await res.text());
  process.exit(1);
}
const body = await res.json();
const got = new Set((body.templates || []).map((t) => t.id));
const missing = [...want].filter((id) => !got.has(id));
if (missing.length) {
  console.error('[drift] Missing SendGrid templates:', missing.join(', '));
  process.exit(1);
}
console.log('SendGrid drift: OK');
```

---

## `scripts/validate/ajv-validate.mjs`

```js
#!/usr/bin/env node
import fs from 'node:fs';
import { load as yamlLoad } from 'js-yaml';
import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, strict: false });

const checks = [
  {
    name: 'decap-config',
    schema: 'schemas/decap-config.schema.json',
    file: 'public/admin/config.yml',
  },
  {
    name: 'sendgrid-desired',
    schema: 'schemas/sendgrid-templates.schema.json',
    file: 'desired-state/sendgrid.templates.json',
  },
];

let failed = false;

for (const c of checks) {
  try {
    const schema = JSON.parse(fs.readFileSync(c.schema, 'utf8'));
    const raw = fs.readFileSync(c.file, 'utf8');
    const data =
      c.file.endsWith('.yml') || c.file.endsWith('.yaml') ? yamlLoad(raw) : JSON.parse(raw);
    const validate = ajv.compile(schema);
    const ok = validate(data);
    if (!ok) {
      failed = true;
      console.error(`[${c.name}] schema errors:`);
      console.error(validate.errors);
    }
  } catch (e) {
    failed = true;
    console.error(`[${c.name}] failed to validate: ${e.message}`);
  }
}

process.exit(failed ? 1 : 0);
```

---

## `scripts/gates/require-docs.mjs`

```js
#!/usr/bin/env node
/**
 * Fails if code paths changed but docs/ADR/CHANGELOG were not touched.
 * Intended for PR CI where we can read the diff from GITHUB_SHA / BASE_SHA.
 * For local runs, we fallback to 'git diff --name-only origin/main...HEAD'.
 */
import { execSync } from 'node:child_process';

function sh(cmd) {
  return execSync(cmd, { stdio: 'pipe' }).toString().trim();
}

let base = process.env.GITHUB_BASE_SHA || process.env.GITHUB_EVENT_BEFORE;
if (!base) {
  try {
    base = sh('git merge-base origin/main HEAD');
  } catch {
    base = 'HEAD~1';
  }
}
const head = process.env.GITHUB_SHA || 'HEAD';

const diff = sh(`git diff --name-only ${base} ${head}`).split('\n').filter(Boolean);
const touchedCode = diff.some(
  (p) =>
    p.startsWith('src/') ||
    p.startsWith('functions/') ||
    p.startsWith('workers/') ||
    p === 'wrangler.toml' ||
    p.startsWith('public/admin/')
);
const touchedDocs = diff.some(
  (p) =>
    p === 'CHANGELOG.md' ||
    p === 'ARCHITECTURE.md' ||
    p.startsWith('docs/decisions/') ||
    (p.startsWith('docs/') && p.endsWith('.md'))
);

if (touchedCode && !touchedDocs) {
  console.error('Docs gate: code changed but no docs/ADR/CHANGELOG updated.');
  console.error('Changed files:\n' + diff.join('\n'));
  process.exit(1);
}
console.log('Docs gate: OK');
```

---

# 5) Optional helper: generate inputs for `policy/code/architecture.rego`

If you want to run the “required files” and “git files” checks via Conftest, add this quick input generator and call `conftest test` on the generated JSON.

## `scripts/policy-inputs.mjs`

```js
#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const required = JSON.parse(fs.readFileSync('desired-state/repo.required-files.json', 'utf8'));
const files = execSync('git ls-files', { stdio: 'pipe' }).toString().trim().split('\n');

const inputs = [
  { kind: 'repo.required', required: required.required, present: files },
  { name: 'git.files', files: files },
];

fs.writeFileSync('policy-inputs.json', JSON.stringify(inputs, null, 2));
console.log('policy-inputs.json written');
```

## `desired-state/repo.required-files.json`

```json
{
  "required": [
    "README.md",
    "CONTRIBUTING.md",
    "RUNBOOK.md",
    "ARCHITECTURE.md",
    "DEPLOYMENT.md",
    "SECRETS.md",
    "ENVIRONMENT.md",
    "SECURITY.md",
    "PRIVACY.md",
    ".github/CODEOWNERS",
    "docs/onboarding.md",
    "docs/decisions/0001-astro-svelte-tailwind.md",
    "docs/decisions/0002-decap-github-backend.md",
    "desired-state/cloudflare.pages.json",
    "desired-state/cloudflare.worker-oauth.json",
    "desired-state/sendgrid.templates.json",
    "public/admin/config.yml"
  ]
}
```

Run:

```bash
node scripts/policy-inputs.mjs
conftest test --policy policy policy-inputs.json package.json public/admin/config.yml
```

---

## That’s it

- **Rego policies**: guard structure, secrets handling, CMS config, docs discipline.
- **Schemas**: keep Decap config and SendGrid desired state well-formed.
- **Drift scripts**: compare Cloudflare Pages/Worker secrets & SendGrid templates vs desired state.
- **Docs gate**: ensures architecture/docs don’t drift when agents (or humans) change code.
