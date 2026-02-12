# Vercel Deployment Configuration

## Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or 20.x

## Environment Variables (Add in Vercel Dashboard)

### Required
```
DATABASE_URL=your_postgres_connection_string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
AUTH_TRUST_HOST=true
NEXT_PUBLIC_APP_NAME=LekhyaAI
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Optional (for email features)
```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

### Optional (for GST API)
```
GST_API_BASE_URL=https://api.masterindia.com
GST_API_KEY=your_api_key
```

## Database Setup

### Option 1: Vercel Postgres (Recommended)
1. Go to Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Vercel will automatically set `DATABASE_URL`
3. Vercel will automatically set `DATABASE_URL`
4. **IMPORTANT**: We have automating the switching to PostgreSQL. The build command `npm run vercel-build` will:
   - Swap `schema.prisma` with `schema.postgres.prisma`
   - Run `prisma db push` to sync the schema (bypassing SQLite migration history)
   - Build the Next.js app

### Option 2: Supabase
1. Create project at https://supabase.com
2. Get connection string from Project Settings → Database
3. Add to Vercel environment variables
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require`

### Option 3: Neon
1. Create database at https://neon.tech
2. Copy connection string
3. Add to Vercel environment variables

## Post-Deployment Steps

1. **Run Database Migration**
   ```bash
   # In Vercel project settings, add build command:
   prisma generate && prisma migrate deploy && next build
   ```

2. **Seed Database** (if needed)
   ```bash
   npx prisma db seed
   ```

3. **Verify Deployment**
   - Check build logs for errors
   - Test login at https://your-app.vercel.app/login
   - Default credentials: admin@admin.com / test123

## Common Deployment Errors & Fixes

### Error: "Module not found: Can't resolve '@/components/ui/select'"
**Fix**: Already fixed - select.tsx component exists

### Error: "Property 'item' does not exist on type 'PrismaClient'"
**Fix**: Run `npx prisma generate` before build

### Error: "NEXTAUTH_URL is not set"
**Fix**: Add NEXTAUTH_URL to Vercel environment variables

### Error: "Database connection failed"
**Fix**: Ensure DATABASE_URL is set correctly with `?sslmode=require` for cloud databases

### Error: "Build timeout"
**Fix**: Optimize build by removing unused dependencies

## Vercel CLI Deployment (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Performance Optimization

1. **Enable Edge Runtime** (for faster cold starts)
   - Add to API routes: `export const runtime = 'edge'`

2. **Enable ISR** (Incremental Static Regeneration)
   - Add to pages: `export const revalidate = 60`

3. **Optimize Images**
   - Use Next.js Image component
   - Enable image optimization in next.config.js

## Monitoring

- **Analytics**: Enable Vercel Analytics in dashboard
- **Logs**: View real-time logs in Vercel dashboard
- **Errors**: Set up error tracking (Sentry integration)
