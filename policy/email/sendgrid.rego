package email.sendgrid

# Validate template IDs are well-formed (prefix 'd-')
deny[msg] {
  input.name == "sendgrid.templates"
  some t
  tdata := input.templates[t]
  not startswith(tdata.id, "d-")
  msg := sprintf("SendGrid template id invalid (must start with d-): %s", [tdata.id])
}

# Template IDs must be 34 characters (d- plus 32 hex)
deny[msg] {
  input.name == "sendgrid.templates"
  some t
  tdata := input.templates[t]
  count(tdata.id) != 34
  msg := sprintf("SendGrid template id invalid length (must be 34 chars): %s", [tdata.id])
}

# Template names must be meaningful
deny[msg] {
  input.name == "sendgrid.templates"
  some t
  tdata := input.templates[t]
  count(tdata.name) < 3
  msg := sprintf("SendGrid template name too short: %s", [tdata.name])
}

# Check for required template types
deny[msg] {
  input.name == "sendgrid.templates"
  required_names := ["ContactReceived", "ContactConfirmation"]
  some required in required_names
  not has_template_name(required)
  msg := sprintf("Missing required SendGrid template: %s", [required])
}

# Helper to check template names
has_template_name(name) {
  some t
  input.templates[t].name == name
}