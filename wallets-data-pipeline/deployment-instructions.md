# 🚀 Deployment Instructions

## Phase 1: Setup Private Repository

### 1. Create Private Repository
```bash
# Create new private repo on GitHub (manually via web interface)
# Name: wallets-data-pipeline-private (or similar)
```

### 2. Move Files to Private Repo
```bash
# From your current directory
cd wallets-data-pipeline
git init
git add .
git commit -m "Initial data pipeline setup"
git remote add origin https://github.com/YOUR_USERNAME/wallets-data-pipeline-private.git
git push -u origin main
```

### 3. Set GitHub Secrets
In your private repository settings → Secrets and variables → Actions, add:

```
AIRTABLE_API_KEY=your_key_here
AIRTABLE_PARTNERS_BASE_ID=your_base_id
AIRTABLE_DEFI_BASE_ID=your_defi_base_id
CLOUDFLARE_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=wallets-data
```

### 4. Configure Environment
```bash
# In your private repo
cp .env.example .env
# Edit .env with your actual values
npm install
```

## Phase 2: Setup Cloudflare R2

### 1. Create R2 Bucket
1. Go to Cloudflare Dashboard → R2 Object Storage
2. Create bucket named `wallets-data`
3. Note your Account ID

### 2. Generate API Tokens
1. Go to "Manage R2 API Tokens"
2. Create token with "Object Read & Write" permissions
3. Save Access Key ID and Secret Access Key

### 3. Configure Public Access (Optional)
1. In bucket settings, enable public access
2. Or set up custom domain for cleaner URLs

## Phase 3: Test Private Pipeline

### 1. Test Locally
```bash
# In your private repo
npm run fetch    # Should download from Airtable
npm run build    # Should upload to R2
```

### 2. Verify Upload
- Check Cloudflare R2 dashboard
- Verify files exist: `assets.json`, `ramps.json`, `exchanges.json`, `defi.json`
- Test public URLs work

### 3. Test GitHub Actions
- Push to main branch
- Check Actions tab for successful run

## Phase 4: Update Public Repository

### 1. Add Fetch Script
Copy `public-repo-fetch-script.mjs` to `scripts/fetch-data.mjs` in your public repo.

### 2. Update Package.json
```json
{
  "scripts": {
    "fetch-data": "node scripts/fetch-data.mjs",
    "build": "npm run fetch-data && docusaurus build",
    "start": "npm run fetch-data && docusaurus start"
  }
}
```

### 3. Update Environment
Add to your public repo's `.env` or build environment:
```
R2_BASE_URL=https://wallets-data.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
```

### 4. Remove Old Scripts
```bash
# In your public repo
rm scripts/build-assets.mjs
rm scripts/build-data.mjs
rm scripts/build-defi.mjs
rm scripts/fetch-airtable.mjs
rm -rf data/
```

## Phase 5: Test End-to-End

### 1. Test Public Repo
```bash
# In your public repo
npm run fetch-data  # Should download from R2
npm run build       # Should build successfully
```

### 2. Verify Data Flow
1. Update data in Airtable
2. Trigger GitHub Action in private repo (or wait for scheduled run)
3. Verify updates appear in R2
4. Test public repo picks up changes

## Phase 6: Go Live

### 1. Update CI/CD
If using deployment services (Vercel, Netlify), update build commands:
```
npm run fetch-data && npm run build
```

### 2. Set Environment Variables
Add `R2_BASE_URL` to your deployment environment.

### 3. Monitor
- Check GitHub Actions in private repo run successfully
- Monitor R2 usage in Cloudflare dashboard
- Verify public site updates correctly

## 🔧 URLs to Update

After setup, your data will be available at:
```
https://wallets-data.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com/assets.json
https://wallets-data.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com/ramps.json
https://wallets-data.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com/exchanges.json
https://wallets-data.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com/defi.json
```

## 🚨 Rollback Plan

If something goes wrong:

1. **Immediate**: Copy current `/src/data/*.json` files as backup
2. **Temporary**: Revert public repo to use local data
3. **Debug**: Check private repo logs and R2 bucket
4. **Fix**: Address issues and re-deploy

## ✅ Success Checklist

- [ ] Private repo created and configured
- [ ] GitHub secrets added
- [ ] R2 bucket created and accessible
- [ ] Local pipeline test successful
- [ ] GitHub Actions running successfully
- [ ] Public repo updated to fetch from R2
- [ ] End-to-end test completed
- [ ] Monitoring in place
- [ ] Documentation updated

---

**🎯 Ready?** Start with Phase 1 and work through each phase systematically! 