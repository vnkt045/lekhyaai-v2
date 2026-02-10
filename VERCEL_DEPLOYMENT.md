# 🚀 Deploy LekhyaAI V2 to Vercel - Step by Step

## ✅ Prerequisites Complete
- ✅ Code pushed to GitHub: https://github.com/vnkt045/lekhyaai-v2
- ✅ Production build tested locally
- ✅ Vercel configuration ready

---

## 📝 Deployment Steps

### Step 1: Go to Vercel Dashboard

1. Open your browser and go to: **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

---

### Step 2: Import Your Project

#### Option A: From Dashboard
1. Click **"Add New..."** button (top-right)
2. Select **"Project"**
3. You'll see "Import Git Repository" page

#### Option B: Direct Link
Go to: **https://vercel.com/new**

---

### Step 3: Select Repository

1. Under **"Import Git Repository"**, find your repository:
   ```
   vnkt045/lekhyaai-v2
   ```

2. If you don't see it:
   - Click **"Adjust GitHub App Permissions"**
   - Select **"Only select repositories"**
   - Choose `lekhyaai-v2`
   - Click **"Save"**

3. Click **"Import"** next to `lekhyaai-v2`

---

### Step 4: Configure Project

Vercel will auto-detect Next.js settings:

**Framework Preset**: Next.js ✅ (auto-detected)

**Root Directory**: `./` ✅ (default)

**Build Command**: 
```bash
npm run vercel-build
```
✅ (auto-detected from package.json)

**Output Directory**: `.next` ✅ (auto-detected)

**Install Command**: `npm install` ✅ (auto-detected)

> ⚠️ **IMPORTANT**: Do NOT click "Deploy" yet! We need to set up the database first.

---

### Step 5: Create Postgres Database

#### 5.1 Skip Deployment for Now
1. Click **"Environment Variables"** to expand
2. Scroll down and click **"Deploy Later"** or just close the tab
3. Go to your Vercel dashboard: https://vercel.com/dashboard

#### 5.2 Find Your Project
1. You should see `lekhyaai-v2` in your projects list
2. Click on it

#### 5.3 Create Database
1. Click on the **"Storage"** tab (top menu)
2. Click **"Create Database"** button
3. Select **"Postgres"** (powered by Neon)

#### 5.4 Configure Database
- **Database Name**: `lekhyaai-db` (or any name you prefer)
- **Region**: Select **Mumbai (bom1)** for best performance in India
- Click **"Create"**

#### 5.5 Connect Database to Project
1. After database creation, you'll see a success message
2. Click **"Connect Project"** button
3. Select your project: `lekhyaai-v2`
4. Click **"Connect"**

✅ Vercel will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← This is your `DATABASE_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

---

### Step 6: Add Additional Environment Variables

1. Go to **Settings** tab
2. Click **"Environment Variables"** (left sidebar)
3. Add the following variables:

#### Required Variables:

**1. NEXTAUTH_SECRET**
```
Variable Name: NEXTAUTH_SECRET
Value: [Generate using command below]
Environment: Production, Preview, Development
```

**Generate the secret** (run in your terminal):
```bash
openssl rand -base64 32
```
Copy the output and paste as the value.

**2. NEXTAUTH_URL**
```
Variable Name: NEXTAUTH_URL
Value: https://lekhyaai-v2.vercel.app
Environment: Production
```
(Replace with your actual Vercel URL after first deployment)

**3. NEXT_PUBLIC_APP_URL**
```
Variable Name: NEXT_PUBLIC_APP_URL
Value: https://lekhyaai-v2.vercel.app
Environment: Production
```

> 💡 **Tip**: For now, use the default Vercel URL. You can update these later if you add a custom domain.

---

### Step 7: Deploy!

#### Option A: From Deployments Tab
1. Go to **"Deployments"** tab
2. Click **"Deploy"** button
3. Select branch: `main`
4. Click **"Deploy"**

#### Option B: Trigger from Git
```bash
# Make any small change and push
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

---

### Step 8: Monitor Deployment

Watch the build logs in real-time:

**Expected Steps:**
1. ✅ Cloning repository
2. ✅ Installing dependencies (`npm install`)
3. ✅ Running `postinstall` (Prisma generate)
4. ✅ Running `vercel-build`:
   - Generating Prisma client
   - Running database migrations
   - Building Next.js app
5. ✅ Uploading build output
6. ✅ Deployment complete!

**Build Time**: ~2-3 minutes

---

### Step 9: Verify Deployment

#### 9.1 Get Your URL
After deployment completes, you'll see:
```
✅ Deployment Ready
🌐 https://lekhyaai-v2.vercel.app
```

#### 9.2 Test Your Application
1. Click the URL to open your app
2. Test the following:
   - ✅ Dashboard loads
   - ✅ Navigation works (Invoices, Vouchers, GST Returns)
   - ✅ UI renders correctly (Indian colors, POS style)
   - ✅ No console errors (press F12 → Console tab)

---

### Step 10: Update Environment Variables (Optional)

If you want to use the actual Vercel URL:

1. Go to **Settings** → **Environment Variables**
2. Edit `NEXTAUTH_URL`:
   - Change to: `https://lekhyaai-v2.vercel.app`
3. Edit `NEXT_PUBLIC_APP_URL`:
   - Change to: `https://lekhyaai-v2.vercel.app`
4. **Redeploy** for changes to take effect

---

## 🔧 Troubleshooting

### Build Fails: "Prisma Client Not Generated"

**Solution**: The `postinstall` script should handle this. If it fails:
1. Check `package.json` has:
   ```json
   "postinstall": "prisma generate"
   ```
2. Redeploy

### Build Fails: "Database Connection Error"

**Solution**:
1. Verify database is connected to project
2. Check `DATABASE_URL` environment variable exists
3. Make sure you're using `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)

### Build Fails: "Migration Error"

**Solution**:
1. The database is empty, migrations will create tables automatically
2. If it still fails, check Prisma schema syntax
3. Try manual migration:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Pull env variables
   vercel env pull .env.local
   
   # Run migrations
   npx prisma migrate deploy
   ```

### Deployment Succeeds but Page Shows Error

**Solution**:
1. Check browser console for errors (F12)
2. Check Vercel function logs:
   - Go to **Deployments** → Click your deployment → **Functions** tab
3. Common issues:
   - Missing environment variables
   - Database connection timeout
   - Server component errors

---

## 🎯 Post-Deployment Checklist

After successful deployment:

- [ ] Visit your app URL
- [ ] Test all pages (Dashboard, Invoices, Vouchers, GST Returns)
- [ ] Check mobile responsiveness
- [ ] Verify no console errors
- [ ] Test navigation
- [ ] Check that Indian UI/UX renders correctly

---

## 📊 Vercel Dashboard Features

### Analytics
1. Go to **Analytics** tab
2. Enable **Web Analytics** (free)
3. Monitor:
   - Page views
   - Performance metrics
   - User behavior

### Database Management
1. Go to **Storage** → Your database
2. Click **"Data"** tab to view tables
3. Use **"Query"** tab to run SQL

### Logs
1. Go to **Deployments** → Select deployment
2. Click **"Functions"** to see serverless function logs
3. Debug runtime errors

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `lekhyaai.com`
4. Follow DNS configuration instructions
5. Update environment variables:
   - `NEXTAUTH_URL`: `https://lekhyaai.com`
   - `NEXT_PUBLIC_APP_URL`: `https://lekhyaai.com`

---

## 📈 Next Steps After Deployment

1. **Set Up Authentication**
   - Implement NextAuth.js
   - Create login/signup pages
   - Add user management

2. **Create API Routes**
   - Invoice CRUD operations
   - Voucher management
   - GST calculations

3. **Connect Database**
   - Test Prisma queries
   - Seed initial data
   - Create first tenant

4. **Enable Features**
   - AI bill scanning
   - GSTR-1/3B generation
   - ITC reconciliation

---

## 🔗 Useful Links

- **Your App**: https://lekhyaai-v2.vercel.app (after deployment)
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/vnkt045/lekhyaai-v2
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## 🎉 Summary

**Deployment Steps:**
1. ✅ Go to Vercel → Import from GitHub
2. ✅ Create Postgres database (Mumbai region)
3. ✅ Connect database to project
4. ✅ Add environment variables (NEXTAUTH_SECRET)
5. ✅ Deploy!
6. ✅ Test your app

**Expected Result**: Your app will be live at `https://lekhyaai-v2.vercel.app`

---

**Ready to deploy!** 🚀

Follow the steps above, and your LekhyaAI V2 will be live in ~5 minutes!
