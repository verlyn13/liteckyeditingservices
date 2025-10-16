## DIRECTIVE FOR CLOUDFLARE DEPLOYMENT

To properly deploy to Cloudflare Pages:

1. **Load Credentials (Use Fish shell):**

   ```bash
   source scripts/load-cloudflare-env.fish
   # This sets: CF_API_TOKEN, CF_ZONE_ID, CF_ACCOUNT_ID
   ```

2. **Account ID is: 13eb584192d9cefb730fde0cfd271328**

3. **Deploy to Pages (Git-connected project):**

   ```bash
   # Project is Git-connected as 'liteckyeditingservices'; use dashboard or push to main
   # Legacy (manual) deploy syntax retained for reference with correct project name:
   pnpm wrangler pages deploy dist/ --project-name=liteckyeditingservices
   ```

4. **For Infrastructure Setup (D1, R2, KV):**
   The account ID is already set in environment after sourcing the script.

   Create D1: pnpm wrangler d1 create litecky-db
   Create R2: pnpm wrangler r2 bucket create litecky-uploads
   Create KV: pnpm wrangler kv:namespace create CACHE

Note: The script now properly loads the account ID automatically!
