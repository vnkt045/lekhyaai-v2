# LekhyaAI V2 - Deployment Guide

This guide will walk you through deploying LekhyaAI V2 to Vercel with a PostgreSQL database.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- Git installed locally

---

## 🚀 Step 1: Push to GitHub

### 1.1 Initialize Git Repository

```bash
# Navigate to project directory
cd d:\AntiGravity_Projects\LekhyaAIV2

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: LekhyaAI V2 - GST Accounting SaaS"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `lekhyaai-v2` (or your preferred name)
3. **Do NOT** initialize with README (we already have one)
4. Keep it **Private** or **Public** based on your preference

### 1.3 Push to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/lekhyaai-v2.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🗄️ Step 2: Set Up Vercel Postgres Database

### 2.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (`lekhyaai-v2`)
4. **DO NOT DEPLOY YET** - we need to set up the database first

### 2.2 Create Postgres Database

1. In your Vercel project, go to **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"** (powered by Neon)
4. Choose a database name: `lekhyaai-db`
5. Select region: **Mumbai (bom1)** for best performance in India
6. Click **"Create"**

### 2.3 Connect Database to Project

1. After database creation, click **"Connect Project"**
2. Select your `lekhyaai-v2` project
3. Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ← **Use this for DATABASE_URL**
   - `POSTGRES_URL_NON_POOLING`

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 In Vercel Dashboard

Go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | (Auto-set by Postgres) | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://your-preview.vercel.app` | Preview |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `LekhyaAI` | All |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |

**Important**: 
- `DATABASE_URL` should use `POSTGRES_PRISMA_URL` value (connection pooling enabled)
- Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

### 3.2 Update Vercel Project Settings

1. Go to **Settings** → **General**
2. Set **Build Command**: `npm run vercel-build`
3. Set **Output Directory**: `.next`
4. Set **Install Command**: `npm install`

---

## 🏗️ Step 4: Deploy to Vercel

### 4.1 Initial Deployment

1. Go to **Deployments** tab
2. Click **"Deploy"** or push a commit to GitHub
3. Vercel will automatically:
   - Install dependencies
   - Generate Prisma client (`postinstall` script)
   - Run database migrations (`vercel-build` script)
   - Build Next.js app
   - Deploy to production

### 4.2 Monitor Deployment

Watch the build logs for:
- ✅ `prisma generate` - Prisma client generation
- ✅ `prisma migrate deploy` - Database migrations
- ✅ `next build` - Next.js build

### 4.3 First Deployment Issues?

If deployment fails, check:

**Common Issue 1: Prisma Client Not Generated**
- Solution: Ensure `postinstall` script is in `package.json`
- Redeploy after fixing

**Common Issue 2: Database Connection Error**
- Solution: Verify `DATABASE_URL` is set correctly
- Use `POSTGRES_PRISMA_URL` value, not `POSTGRES_URL`

**Common Issue 3: Migration Errors**
- Solution: Manually run migrations in Vercel Postgres
- Use Vercel CLI: `vercel env pull` then `npx prisma migrate deploy`

---

## 🗃️ Step 5: Initialize Database

### 5.1 Run Migrations (First Time)

Migrations will run automatically during deployment via `vercel-build` script.

If you need to run manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

### 5.2 Access Database

**Option 1: Vercel Dashboard**
- Go to **Storage** → Your database → **Data** tab
- View tables and data directly

**Option 2: Prisma Studio**
```bash
# Pull env variables
vercel env pull .env.local

# Open Prisma Studio
npx prisma studio
```

**Option 3: Direct Connection**
- Use the `POSTGRES_URL_NON_POOLING` for direct connections
- Connect with tools like TablePlus, DBeaver, pgAdmin

---

## 🔄 Step 6: Continuous Deployment

### Automatic Deployments

Every push to `main` branch will trigger:
1. Automatic build on Vercel
2. Prisma client generation
3. Database migrations (if any)
4. Deployment to production

### Preview Deployments

Every pull request creates a preview deployment:
- Unique URL: `lekhyaai-v2-git-branch-name.vercel.app`
- Shares production database (or create separate preview DB)

---

## 🌐 Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. Go to **Settings** → **Domains**
2. Add your domain: `lekhyaai.com`
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your domain

### 7.2 Update Environment Variables

After domain is active:
- `NEXTAUTH_URL`: `https://lekhyaai.com`
- `NEXT_PUBLIC_APP_URL`: `https://lekhyaai.com`

---

## 🔒 Security Checklist

Before going live:

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting (Vercel Edge Config)
- [ ] Review database security rules
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Configure backup strategy for database

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Go to **Analytics** tab
2. Enable **Web Analytics** (free)
3. Monitor page views, performance, and user behavior

### Database Monitoring

1. Go to **Storage** → Your database → **Insights**
2. Monitor:
   - Query performance
   - Connection pool usage
   - Storage usage

---

## 🐛 Troubleshooting

### Build Fails with "Prisma Client Not Found"

**Solution**:
```json
// package.json
"scripts": {
  "postinstall": "prisma generate",
  "build": "prisma generate && next build"
}
```

### Database Connection Timeout

**Solution**:
- Use `POSTGRES_PRISMA_URL` (with connection pooling)
- Not `POSTGRES_URL` (direct connection)

### Migration Fails on Deployment

**Solution**:
```bash
# Manually deploy migrations
vercel env pull
npx prisma migrate deploy
```

### Environment Variables Not Working

**Solution**:
- Ensure variables are set for correct environment (Production/Preview/Development)
- Redeploy after adding new variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

---

## 📈 Scaling Considerations

### Database Limits (Vercel Postgres Free Tier)

- **Storage**: 256 MB
- **Compute**: 0.25 vCPU
- **Connections**: 60 concurrent

**Upgrade when**:
- Database exceeds 200 MB
- Frequent connection pool exhaustion
- Need more than 1 GB storage

### Vercel Limits (Free Tier)

- **Bandwidth**: 100 GB/month
- **Builds**: 6000 minutes/month
- **Serverless Function Execution**: 100 GB-hours

---

## 🎯 Post-Deployment Tasks

1. **Test the application**:
   - Visit your Vercel URL
   - Test invoice creation
   - Verify GST calculations
   - Check database persistence

2. **Set up monitoring**:
   - Enable Vercel Analytics
   - Configure error tracking
   - Set up uptime monitoring

3. **Create first tenant**:
   - Use Prisma Studio or API
   - Create company/tenant record
   - Create admin user

4. **Documentation**:
   - Update README with live URL
   - Document API endpoints
   - Create user guide

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## 📞 Support

For deployment issues:
1. Check Vercel build logs
2. Review Prisma migration logs
3. Consult Vercel documentation
4. Contact Vercel support (if needed)

---

**Deployment Status**: Ready for GitHub and Vercel ✅

*Last Updated: February 10, 2026*
