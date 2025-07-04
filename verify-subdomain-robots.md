# Subdomain Robots.txt Configuration

## Important Note

The robots.txt file in the `/public` directory only applies to the main domain (www.cdlhelp.com). The test subdomain (test.cdlhelp.com) needs its own robots.txt file.

## Verification Steps

1. **Check if test.cdlhelp.com has a robots.txt:**
   - Visit: https://test.cdlhelp.com/robots.txt
   - If it returns 404 or has restrictive rules, that's the issue

2. **Deploy the same robots.txt to test subdomain:**
   - Ensure the test environment has the same permissive robots.txt
   - The file should allow all /\_next/ paths

3. **Blocked Resources Analysis:**
   All blocked resources are legitimate Next.js assets:
   - CSS files: `/_next/static/css/*.css`
   - JavaScript: `/_next/static/chunks/*.js`
   - Images: `/_next/image?url=...`
   - Build manifests: `/_next/static/[buildId]/*.js`

## Current robots.txt Configuration

The updated robots.txt now:

- Explicitly allows `/_next/` (all Next.js paths)
- Allows `/_next/static/` (static assets)
- Allows `/_next/image` (image optimization API)
- Only blocks specific sensitive paths

## Deployment Checklist

- [ ] Deploy updated robots.txt to www.cdlhelp.com
- [ ] Deploy same robots.txt to test.cdlhelp.com
- [ ] Verify both URLs serve the correct robots.txt
- [ ] Re-run SEO audit after deployment
