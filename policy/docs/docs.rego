package docs.rules

# Code changes require documentation update
deny[msg] {
  input.name == "pr.changed"
  input.touched_code == true
  not input.touched_docs
  not input.skip_docs_check  # Allow override with label
  msg := "code changes require doc/ADR or CHANGELOG update (or add 'skip-docs' label)"
}

# Major changes require ADR
deny[msg] {
  input.name == "pr.changed"
  input.major_change == true
  not input.has_adr
  msg := "major architectural changes require an ADR in docs/decisions/"
}

# API changes require API docs update
deny[msg] {
  input.name == "pr.changed"
  input.api_changed == true
  not input.api_docs_updated
  msg := "API changes require updating docs/api/"
}

# Security changes require security docs
deny[msg] {
  input.name == "pr.changed"
  input.security_changed == true
  not input.security_docs_updated
  msg := "security-related changes require SECURITY.md or security playbook update"
}

# Check documentation completeness
deny[msg] {
  input.name == "docs.inventory"
  required_docs := [
    "README.md",
    "CONTRIBUTING.md",
    "ENVIRONMENT.md",
    "PROJECT-STATUS.md",
    "docs/onboarding.md"
  ]
  some doc in required_docs
  not doc_exists(doc)
  msg := sprintf("Required documentation missing: %s", [doc])
}

# Helper to check if doc exists
doc_exists(path) {
  some d
  input.docs[d] == path
}