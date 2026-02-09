# 🔍 Troubleshooting 404 Errors - Quick Diagnostic

## Current Status
✅ Backend server running on port 5000  
✅ Frontend server running on port 5173  
✅ Routes configured correctly at `/api/pdf/*`  
✅ Vite proxy configured correctly  

## The Real Issue

The error you're seeing as "404" is actually an **Authentication Error (401)**.

When I tested the backend directly:
```
POST http://localhost:5000/api/pdf/merge
Response: {"message":"Authentication required"}
```

This means:
- ✅ The backend IS working
- ✅ The route IS found
- ❌ **You are NOT logged in** OR the auth token is not being sent

## How to Fix

### Step 1: Verify You Are Logged In

1. Open browser DevTools (F12)
2. Go to **Application** tab → **Local Storage** → `http://localhost:5173`
3. Look for Supabase auth data
4. If empty or missing → **You need to login!**

### Step 2: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Try a PDF operation
4. Look for the actual error message
5. It might say:
   - "Authentication required" (401) - You're not logged in
   - "Invalid or expired token" (401) - Session expired, login again
   - "Request failed with status code 404" - Different issue

### Step 3: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try a PDF operation (e.g., merge)
4. Click on the failed request
5. Check:
   - **Request URL**: Should be `http://localhost:5173/api/pdf/merge`
   - **Status Code**: What is it? (401, 404, 500?)
   - **Response**: What does it say?
   - **Request Headers**: Is there an `Authorization: Bearer ...` header?

## Common Scenarios

### Scenario A: Not Logged In
**Symptoms:** No Authorization header in request  
**Solution:** Login/Register first, then try PDF operations

### Scenario B: Session Expired
**Symptoms:** Authorization header present but getting 401  
**Solution:** Logout and login again

### Scenario C: Actual 404 Error
**Symptoms:** Request URL is wrong (e.g., `/api/api/pdf/merge`)  
**Solution:** This shouldn't happen with our fix, but if it does, clear browser cache and restart both servers

### Scenario D: CORS Error
**Symptoms:** Error mentions CORS or "blocked by CORS policy"  
**Solution:** Backend CORS is already configured, but restart backend server

## Quick Test

1. **Logout** (if logged in)
2. **Login again** with your Supabase account
3. **Go to Dashboard**
4. **Try a PDF operation**

If it still fails:
1. Open DevTools → Network tab
2. Try the operation again
3. Take a screenshot of the failed request
4. Share the:
   - Request URL
   - Status code
   - Response body
   - Whether Authorization header is present

## Most Likely Solution

**You need to login first!**

The PDF routes require authentication. Make sure you:
1. Have a Supabase account
2. Are logged in
3. Can see the Dashboard (protected route)
4. Then try PDF operations

---

> [!IMPORTANT]
> The error message "Request failed with status code 404" might be misleading. The actual error is likely **401 Authentication Required**. Always check the browser DevTools Network tab for the real error!
