package code.architecture

# Deny if required repo files are missing
deny[msg] {
  input.kind == "repo.required"
  some i
  required := input.required[i]
  not file_exists(required)
  msg := sprintf("required file missing: %s", [required])
}

# Helper: check if file exists in the present list
file_exists(path) {
  some j
  input.present[j] == path
}

# No .env files committed (except .example files)
deny[msg] {
  input.kind == "git.files"
  some f
  regex.match(`(^|/)\.env($|\.)`, input.files[f])
  not regex.match(`\.example$`, input.files[f])
  not regex.match(`\.template$`, input.files[f])
  not regex.match(`\.sample$`, input.files[f])
  msg := sprintf("forbidden committed file (env): %s", [input.files[f]])
}

# No .dev.vars files committed (except .example files)
deny[msg] {
  input.kind == "git.files"
  some f
  regex.match(`(^|/)\.dev\.vars`, input.files[f])
  not endswith(input.files[f], ".example")
  not endswith(input.files[f], ".template")
  not endswith(input.files[f], ".sample")
  msg := sprintf("forbidden committed file (.dev.vars): %s", [input.files[f]])
}

# No files with "secret" in name (case-insensitive)
deny[msg] {
  input.kind == "git.files"
  some f
  contains(lower(input.files[f]), "secret")
  not contains(input.files[f], "desired-state")  # Allow our desired-state files
  not contains(input.files[f], "_archive")        # Allow archived docs
  msg := sprintf("file name suggests secret committed: %s", [input.files[f]])
}

# Ensure proper directory structure exists
deny[msg] {
  input.kind == "directory.structure"
  required_dirs := [
    "src", "src/components", "src/layouts", "src/pages",
    "src/styles", "src/scripts", "src/content",
    "public", "public/fonts", "public/images",
    "tests", "tests/unit", "tests/e2e",
    "policy", "scripts", "desired-state", "docs"
  ]
  some dir in required_dirs
  not directory_exists(dir)
  msg := sprintf("required directory missing: %s", [dir])
}

# Helper: check if directory exists
directory_exists(path) {
  some d
  input.directories[d] == path
}