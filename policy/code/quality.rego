package code.quality

# Check package.json has expected scripts
deny[msg] {
  input.name == "liteckyeditingservices"
  not input.scripts.check
  msg := "package.json missing script: check"
}

deny[msg] {
  input.name == "liteckyeditingservices"
  not input.scripts["lint:fix"]
  msg := "package.json missing script: lint:fix"
}

deny[msg] {
  input.name == "liteckyeditingservices"
  not input.scripts["test:e2e"]
  msg := "package.json missing script: test:e2e"
}

deny[msg] {
  input.name == "liteckyeditingservices"
  not input.scripts.build
  msg := "package.json missing script: build"
}

deny[msg] {
  input.name == "liteckyeditingservices"
  not input.scripts.dev
  msg := "package.json missing script: dev"
}

# Ensure Node version is 24+
deny[msg] {
  input.engines.node
  not regex.match(`>=24`, input.engines.node)
  msg := sprintf("Node version must be >=24, got: %s", [input.engines.node])
}

# Ensure pnpm version is 10.16+
deny[msg] {
  input.engines.pnpm
  not regex.match(`>=10\.16`, input.engines.pnpm)
  msg := sprintf("pnpm version must be >=10.16, got: %s", [input.engines.pnpm])
}

# Check for outdated packages (September 2025 versions)
deny[msg] {
  input.dependencies
  input.dependencies.astro
  not regex.match(`\^5\.13`, input.dependencies.astro)
  msg := sprintf("Astro version should be ^5.13.x, got: %s", [input.dependencies.astro])
}

deny[msg] {
  input.dependencies
  input.dependencies.svelte
  not regex.match(`\^5`, input.dependencies.svelte)
  msg := sprintf("Svelte version should be ^5.x, got: %s", [input.dependencies.svelte])
}

# Verify test configuration exists
deny[msg] {
  input.name == "project.inventory"
  input.functions_changed == true
  not input.tests_e2e_present
  msg := "changes in /functions require tests in tests/e2e/"
}