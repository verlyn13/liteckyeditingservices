# Cloudflare Custom Security Rule for CI/CD

## Setting Up the Bypass Rule

Navigate to: **Security → Security rules → Custom rules → Create rule**

### Rule Configuration

**Rule name**: `Allow Playwright CI`

**When incoming requests match…**:

Option 1 - User Agent (Simplest):
- **Field**: `User Agent`
- **Operator**: `contains`
- **Value**: `Playwright`

Option 2 - Multiple CI Tools:
- **Field**: `User Agent`
- **Operator**: `contains any`
- **Value**:
  ```
  Playwright
  GitHub-Actions
  ```

Option 3 - GitHub Actions IP Ranges (Most Secure):
- **Field**: `IP Source Address`
- **Operator**: `is in`
- **Value**: Use GitHub Actions IP ranges from https://api.github.com/meta

### Expression Editor (Alternative)

If you prefer the expression editor, use:

```
(http.user_agent contains "Playwright") or (http.user_agent contains "GitHub-Actions")
```

### Then take action…

**Choose action**: `Skip`

Then select what to skip:
- ✅ **All remaining custom rules**
- ✅ **Rate limiting**
- ✅ **Managed rules** (if you have any)
- ✅ **Log**

### Deploy

Click **Deploy** to activate the rule.

## API Alternative

If you prefer to deploy via API:

```bash
curl -X PUT \
    "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/rulesets/phases/http_request_firewall_custom/entrypoint" \
    -H "Authorization: Bearer $CF_AUTH_TOKEN" \
    -d '{
    "rules": [
        {
            "description": "Allow Playwright CI",
            "expression": "(http.user_agent contains \"Playwright\")",
            "action": "skip",
            "action_parameters": {
                "ruleset": "current"
            }
        }
    ]
}'
```

## Verification

After deploying:

1. **Check Security Events**:
   - Go to Security → Events
   - Look for events with "Skip" action
   - Verify Playwright requests are being skipped

2. **Test from CI**:
   - Push a commit to trigger CI
   - Check workflow logs for successful security header tests

3. **Test Locally**:
   ```bash
   PLAYWRIGHT_BASE_URL=https://liteckyeditingservices.com \
     npx playwright test -g "Security Headers" --project=firefox
   ```

## Security Considerations

- **User Agent matching** is easy but can be spoofed
- Consider adding additional conditions like:
  - Specific paths only (`URI Path` contains `/` or specific pages)
  - Specific headers that your CI adds
  - Time-based rules if CI runs on schedule

## Troubleshooting

If tests still fail after adding the rule:

1. **Check rule position**: Custom rules execute in order - ensure this is near the top
2. **Check expression syntax**: Use the Preview to test matching
3. **Check Security Events log**: See if requests are hitting other rules first
4. **Verify User Agent**: Run `console.log(navigator.userAgent)` in Playwright to confirm exact UA string

## Alternative: Page Rules (Legacy)

If Custom Rules don't work, try Page Rules:
1. Go to **Rules → Page Rules**
2. Create rule for `*liteckyeditingservices.com/*`
3. Settings:
   - Security Level: Essentially Off
   - Browser Integrity Check: Off
   - Always Online: Off

Note: Page Rules are being deprecated in favor of the new Rules system.