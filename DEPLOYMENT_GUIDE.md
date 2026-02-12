# SwiftPDF Deployment Guide

## Architecture Overview

This project uses **separate deployments** for optimal performance:
- **Frontend (client/)** → Vercel (Static hosting + CDN)
- **Backend (server/)** → Traditional hosting (Render, Railway, etc.)

## Part 1: Deploy Backend

### Recommended: Render.com (Free Tier Available)

1. **Create Account**: Go to [render.com](https://render.com) and sign up

2. **New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: swiftpdf-api (or your choice)
     - **Environment**: Node
     - **Region**: Choose closest to your users
     - **Branch**: main
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Environment Variables** (Add in Render dashboard):
   ```
   PORT=5000
   NODE_ENV=production
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-key>
   JWT_SECRET=<generate-random-string>
   ```
   
   Copy values from `server/.env`

4. **Deploy**: Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Note your API URL: `https://swiftpdf-api.onrender.com`

5. **Important**: Your backend URL will be `https://YOUR-APP-NAME.onrender.com/api`

### Alternative: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy from server directory
cd server
railway init
railway up
```

## Part 2: Deploy Frontend to Vercel

### Method A: Vercel Dashboard (Easiest)

1. **Push Code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Configure for separate deployments"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
     ```
   - Replace with your actual backend URL from Part 1

4. **Deploy**: Click "Deploy"

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Name: swiftpdf (or your choice)
# - Link to existing project? No
# - Set up and deploy? Yes

# Add environment variable
vercel env add VITE_API_URL production
# Paste: https://YOUR-BACKEND-URL.onrender.com/api

# Deploy to production
vercel --prod
```

## Part 3: Configure CORS (Backend)

Your backend CORS is already configured in `server/server.js`:
```javascript
app.use(cors({
    origin: true, // Reflects request origin
    credentials: true
}));
```

For production, you may want to restrict origins:
```javascript
app.use(cors({
    origin: [
        'https://your-frontend-url.vercel.app',
        'http://localhost:5173' // Keep for local dev
    ],
    credentials: true
}));
```

## Verification Checklist

### Backend (Render/Railway)
- [ ] Deployment successful
- [ ] Environment variables set
- [ ] Can access `https://your-api.onrender.com/` (shows "SwiftPDF API is running")
- [ ] Check logs for errors

### Frontend (Vercel)
- [ ] Build successful
- [ ] Environment variable `VITE_API_URL` set correctly
- [ ] Site loads without errors
- [ ] Check browser console for API URL (should be your production backend)

### Integration Test
- [ ] Open your Vercel URL
- [ ] Navigate to a PDF tool (e.g., Merge)
- [ ] Upload a PDF file
- [ ] Verify in Network tab: API requests go to your backend URL
- [ ] Confirm file processing works
- [ ] Verify download succeeds

## Troubleshooting

### "Backend Server Not Reachable"
- Check backend deployment logs
- Verify `VITE_API_URL` includes `/api` suffix
- Ensure backend is running (Render free tier sleeps after inactivity)

### CORS Errors
- Update `server/server.js` CORS origin to include your Vercel URL
- Redeploy backend after changes

### 404 on Refresh
- Already handled by `vercel.json` rewrites
- All routes go to `index.html` for client-side routing

### Files Not Processing
- Check Render logs: `https://dashboard.render.com`
- Verify environment variables are set
- Check disk space (file uploads stored temporarily)

## Cost Breakdown

### Free Tier (Sufficient for Testing/MVP)
- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Render**: 750 hours/month (enough for 1 service running 24/7)

### If You Outgrow Free Tier
- **Vercel Pro**: $20/month (better performance, more bandwidth)
- **Render Starter**: $7/month per service (always-on, no sleep)

## Next Steps

After deployment:
1. Test all PDF tools thoroughly
2. Set up custom domain (optional)
3. Configure analytics/monitoring
4. Set up error tracking (e.g., Sentry)
5. Enable HTTPS (auto-configured on both platforms)

## Quick Reference

**Your URLs**:
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-api.onrender.com/api`

**Common Commands**:
```bash
# Redeploy frontend
git push origin main  # Auto-deploys on Vercel

# Redeploy backend (Render)
git push origin main  # Auto-deploys

# View frontend logs
vercel logs

# View backend logs
# Go to Render dashboard → Logs tab
```
