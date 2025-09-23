package cms.decap

# Decap backend must be GitHub
deny[msg] {
  input.backend.name != "github"
  msg := "Decap backend must be 'github'"
}

# Decap OAuth URL must use dedicated subdomain
deny[msg] {
  not startswith(input.backend.base_url, "https://cms-auth.")
  msg := "Decap backend.base_url must be a dedicated OAuth subdomain at the root"
}

# Pages collection must map to correct folder
deny[msg] {
  collections := input.collections[_]
  collections.name == "pages"
  not startswith(collections.folder, "src/content/pages")
  msg := "Decap 'pages' collection must map to src/content/pages"
}

# Ensure editorial workflow is enabled
deny[msg] {
  not input.publish_mode
  msg := "Decap should have publish_mode set (editorial_workflow recommended)"
}

# Media folder configuration
deny[msg] {
  not input.media_folder
  msg := "Decap must define media_folder"
}

deny[msg] {
  not input.public_folder
  msg := "Decap must define public_folder"
}