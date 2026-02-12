# GitHub Pages Deployment Guide

## Quick Setup Steps

### 1. Enable GitHub Pages

1. Push your code to GitHub
2. Go to repository **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Add Firebase Secrets

Go to **Settings** → **Secrets and variables** → **Actions** and add these secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key | `AIzaSyC...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Auth Domain | `your-app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage Bucket | `your-app.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | App ID | `1:123:web:abc` |

### 3. Push to Deploy

```bash
git add .
git commit -m "Configure for GitHub Pages"
git push origin main
```

The GitHub Action will automatically build and deploy!

### 4. Configure Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add your GitHub Pages URL:
   - Format: `yourusername.github.io`
   - Or: `yourusername.github.io/repository-name` if not using a custom domain

---

## Alternative: Hardcode Config (Not Recommended for Public Repos)

If you don't want to use GitHub Secrets, you can hardcode Firebase config in `src/services/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc"
};
```

⚠️ **Note**: Firebase API keys are meant to be public and are safe to expose as long as you have proper [Firebase Security Rules](https://firebase.google.com/docs/rules) configured.

---

## Troubleshooting

### Build Fails
- Check that all secrets are set correctly in GitHub
- Ensure secret names match exactly (case-sensitive)

### Authentication Doesn't Work
- Verify Firebase authorized domains include your GitHub Pages URL
- Check browser console for CORS errors

### Assets Not Loading
- Ensure `vite.config.js` has `base: './'` (already configured)

---

## Your Site URL

After deployment, your site will be available at:
- **Without custom domain**: `https://yourusername.github.io/repository-name/`
- **With custom domain**: Configure in **Settings** → **Pages** → **Custom domain**
