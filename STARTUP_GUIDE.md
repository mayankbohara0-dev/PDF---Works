# 🚀 PDF-Works - Complete Startup Guide

## The Problem & Solution

### Issue
Getting "Request failed with status code 404" when using merge, split, or compress functions.

### Root Cause
**The backend server was not running!** The API requests were failing because there was no server listening on port 5000.

### Solution
**Always start BOTH the backend server AND the frontend client.**

---

## ✅ Quick Start (Recommended)

### Option 1: Single Command (Easiest)
From the root `PDF-Works` directory:
```bash
npm run dev
```
This automatically starts both server and client together.

### Option 2: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Wait until you see: `Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Wait until you see: `Local: http://localhost:5173`

### Option 3: Batch Files (Windows)
1. Double-click `start-server.bat`
2. Double-click `start-client.bat`

---

## ✅ Verification Checklist

Before testing PDF operations, verify:

1. **Backend is running:**
   ```bash
   netstat -ano | findstr :5000
   ```
   Should show: `TCP    0.0.0.0:5000    LISTENING`

2. **Frontend is running:**
   - Browser opens at `http://localhost:5173`
   - You can see the landing page

3. **Both are connected:**
   - Open browser console (F12)
   - No CORS or network errors should appear

---

## 🎯 Testing PDF Operations

Once both servers are running:

1. Navigate to `http://localhost:5173`
2. Login/Register with your account
3. Go to Dashboard
4. Select any PDF operation (Merge, Split, or Compress)
5. Upload a PDF file
6. Click the operation button
7. **Success!** No more 404 errors!

---

## 🔧 Troubleshooting

### Still getting 404 errors?

**Check 1: Is the backend running?**
```bash
netstat -ano | findstr :5000
```
If nothing appears, the backend is NOT running. Start it with:
```bash
cd server
npm run dev
```

**Check 2: Are you logged in?**
- All PDF routes require authentication
- Make sure you're logged in with a valid Supabase account
- Check browser console for "Authentication required" errors

**Check 3: Check browser console**
- Open DevTools (F12)
- Go to Network tab
- Try the operation again
- Look for the actual request URL and response

**Check 4: Verify environment variables**
- `server/.env` should have `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- `client/.env` should have `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

---

## 📝 Important Notes

> [!IMPORTANT]
> **You MUST start the backend server** before the PDF operations will work. The frontend alone is not enough!

> [!TIP]
> Use `npm run dev` from the root directory to start both servers automatically with one command.

> [!WARNING]
> If you close the terminal running the backend, all PDF operations will fail with 404 errors.

---

## 🎉 Summary

**The fix is simple:**
1. ✅ Backend server must be running on port 5000
2. ✅ Frontend client must be running on port 5173
3. ✅ You must be logged in with a valid account
4. ✅ Then all PDF operations will work perfectly!

**No code changes needed** - just make sure both servers are running!
