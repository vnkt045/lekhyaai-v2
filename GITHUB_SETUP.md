# 📝 How to Create a GitHub Repository

## Step-by-Step Guide

### Method 1: Using GitHub Website (Recommended)

#### Step 1: Go to GitHub
1. Open your browser and go to: **https://github.com**
2. Sign in to your GitHub account
   - If you don't have an account, click **"Sign up"** and create one

#### Step 2: Create New Repository
1. Click the **"+"** icon in the top-right corner
2. Select **"New repository"**

   OR

   Go directly to: **https://github.com/new**

#### Step 3: Configure Repository Settings

Fill in the following details:

**Repository name**: `lekhyaai-v2`
- Must be unique in your account
- Use lowercase letters, numbers, and hyphens only
- No spaces allowed

**Description** (optional): 
```
AI-powered GST Accounting & Compliance SaaS for Indian SMEs
```

**Visibility**:
- ☑️ **Public** - Anyone can see this repository (recommended for portfolio)
- ⚪ **Private** - Only you and collaborators can see it

**Initialize repository**:
- ⚪ **DO NOT** check "Add a README file"
- ⚪ **DO NOT** check "Add .gitignore"
- ⚪ **DO NOT** check "Choose a license"

> ⚠️ **IMPORTANT**: Leave all checkboxes UNCHECKED because we already have these files locally!

#### Step 4: Create Repository
Click the green **"Create repository"** button

#### Step 5: Copy Repository URL
After creation, you'll see a page with setup instructions. Copy the HTTPS URL:
```
https://github.com/vnkt045/lekhyaai-v2.git
```

---

### Method 2: Using GitHub CLI (Advanced)

If you have GitHub CLI installed:

```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create lekhyaai-v2 --public --source=. --remote=origin --push
```

---

## 🔗 Connect Your Local Repository to GitHub

Now that you have the repository URL, run these commands:

### Step 1: Add Remote Origin
```bash
cd d:\AntiGravity_Projects\LekhyaAIV2
git remote add origin https://github.com/vnkt045/lekhyaai-v2.git
```

### Step 2: Verify Remote
```bash
git remote -v
```
You should see:
```
origin  https://github.com/vnkt045/lekhyaai-v2.git (fetch)
origin  https://github.com/vnkt045/lekhyaai-v2.git (push)
```

### Step 3: Rename Branch to Main (if needed)
```bash
git branch -M main
```

### Step 4: Push to GitHub
```bash
git push -u origin main
```

You may be prompted for authentication:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)

---

## 🔑 Creating a Personal Access Token (if needed)

If you get authentication errors, you need a Personal Access Token:

### Step 1: Go to GitHub Settings
1. Click your profile picture → **Settings**
2. Scroll down to **Developer settings** (left sidebar)
3. Click **Personal access tokens** → **Tokens (classic)**

### Step 2: Generate New Token
1. Click **"Generate new token"** → **"Generate new token (classic)"**
2. Give it a name: `LekhyaAI Deployment`
3. Set expiration: **90 days** (or your preference)
4. Select scopes:
   - ✅ **repo** (Full control of private repositories)
5. Click **"Generate token"**

### Step 3: Copy Token
⚠️ **IMPORTANT**: Copy the token immediately! You won't be able to see it again.

### Step 4: Use Token as Password
When pushing to GitHub, use:
- **Username**: Your GitHub username
- **Password**: Paste the Personal Access Token

---

## 🔧 Troubleshooting

### Error: "remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/vnkt045/lekhyaai-v2.git
```

### Error: "Repository not found"
- Make sure the repository exists on GitHub
- Check the URL is correct
- Verify you're logged in to the correct GitHub account

### Error: "Authentication failed"
- Use a Personal Access Token instead of your password
- Make sure the token has `repo` permissions

---

## ✅ Verification

After successful push, verify:

1. **Go to your repository**: https://github.com/vnkt045/lekhyaai-v2
2. You should see all your files:
   - ✅ README.md
   - ✅ package.json
   - ✅ app/ folder
   - ✅ components/ folder
   - ✅ All other project files

---

## 📸 Visual Guide

### Creating Repository on GitHub:

1. **GitHub Homepage**
   ```
   [+] New repository
   ```

2. **Repository Settings**
   ```
   Repository name: lekhyaai-v2
   Description: AI-powered GST Accounting SaaS
   ○ Public  ○ Private
   
   ⚪ Add a README file
   ⚪ Add .gitignore
   ⚪ Choose a license
   
   [Create repository]
   ```

3. **After Creation**
   ```
   Quick setup — if you've done this kind of thing before
   
   HTTPS: https://github.com/vnkt045/lekhyaai-v2.git
   
   …or push an existing repository from the command line
   git remote add origin https://github.com/vnkt045/lekhyaai-v2.git
   git branch -M main
   git push -u origin main
   ```

---

## 🎯 Quick Commands Summary

```bash
# 1. Remove old remote (if exists)
git remote remove origin

# 2. Add new remote
git remote add origin https://github.com/vnkt045/lekhyaai-v2.git

# 3. Verify
git remote -v

# 4. Push to GitHub
git push -u origin main
```

---

## 📞 Need Help?

- **GitHub Docs**: https://docs.github.com/en/get-started/quickstart/create-a-repo
- **Git Docs**: https://git-scm.com/docs

---

**Ready to create your repository!** 🚀

Follow the steps above, and once the repository is created on GitHub, I'll help you push the code.
