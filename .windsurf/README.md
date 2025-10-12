Windsurf workspace configuration for litecky-editing-services

Overview

- This folder provides project-aware Windsurf configuration for reliable agentic development.
- It wires up common MCP servers, defines Cascade workflows aligned to our pnpm scripts, and scopes context to the most relevant paths.

What’s included

- mcp.json — Registers useful MCP servers via pnpm dlx (no global installs).
- cascade.yaml — Opinionated workflows for dev loop, validation, and testing.

Prerequisites

- Node and pnpm versions are managed by mise (.mise.toml). Run `mise install` in the repo root.
- Install deps once with `pnpm install` before running workflows that spawn the dev server.

Notes

- No secrets are stored here. If any workflow needs API keys, use your local Windsurf model/account settings or environment variables from `.env`/`.dev.vars` (see ENVIRONMENT.md).
- If Cascade reports an “Invalid argument” error, it typically indicates a malformed YAML key or an unsupported workflow step. Validate YAML and ensure commands exist in package.json.

Optional MCP servers

- You can add third‑party MCP servers by editing `.windsurf/mcp.json` and using `pnpm dlx` to avoid global installs. Common options (require API keys):
  - tavily-mcp (web search) — requires `TAVILY_API_KEY`
  - firecrawl-mcp (web crawl) — requires `FIRECRAWL_API_KEY`
- Keep secrets out of the repo; export them in your shell or use `.env` locally.

Visual regression tests

- Use `pnpm test:e2e:visual` locally, or inspect the CI artifact from the `e2e-visual` workflow.
