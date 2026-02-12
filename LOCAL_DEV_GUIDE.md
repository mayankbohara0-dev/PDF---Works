# SwiftPDF - Local Development Guide

## Quick Start (Easiest Way)

### Windows
Double-click `START_DEV.bat` - this will automatically start both servers.

### Manual Start
```bash
# Terminal 1: Start Backend
cd server
npm start

# Terminal 2: Start Frontend  
cd client
npm run dev
```

Then open: **http://localhost:5173**

---

## Current Status

✅ **Backend Server**: Running on http://localhost:5000  
✅ **API Routes**: All configured and working  
✅ **Frontend Config**: Uses localhost for development

---

## Available Features

### ✅ Fully Functional
- **Merge PDFs** - Combine multiple PDF files
- **Split PDFs** - Extract specific pages
- **Compress PDFs** - Reduce file size
- **Repair PDFs** - Fix corrupted files
- **PDF to Image** - Convert pages to PNG/JPG/WebP
- **Protect PDFs** - Add password encryption

### 🚧 Coming Soon (Placeholders)
- **PDF to Word** - Returns 501 status code
- **PDF to Excel** - Returns 501 status code

---

## Troubleshooting

### "Backend Server Not Reachable"

**Solution 1**: Check if backend is running
```bash
# Windows
netstat -ano | findstr ":5000"

# If nothing shows, start the backend:
cd server
npm start
```

**Solution 2**: Check API URL in browser console
- Open DevTools (F12)
- Go to Network tab
- Upload a file
- Check the request URL - should be `http://localhost:5000/api/...`

### "Cannot find module" or Install Errors

```bash
# Reinstall backend dependencies
cd server
rm -rf node_modules
npm install

# Reinstall frontend dependencies
cd client
rm -rf node_modules  
npm install
```

### Port Already in Use

**Backend (5000)**:
```bash
# Windows - Find and kill process
netstat -ano | findstr ":5000"
taskkill /PID <ProcessID> /F
```

**Frontend (5173)**:
```bash
# Windows - Find and kill process
netstat -ano | findstr ":5173"
taskkill /PID <ProcessID> /F
```

### CORS Errors

The server is already configured for development:
```javascript
// server/server.js
app.use(cors({
    origin: true, // Allows all origins
    credentials: true
}));
```

---

## Environment Variables

### Backend (.env in server/)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-key
JWT_SECRET=your-secret
```

### Frontend (.env in client/)
**Not needed for local development** - API URL automatically falls back to localhost

For production deployment, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Testing New Features

1. **Start both servers** (use `START_DEV.bat` or manually)
2. **Open http://localhost:5173**
3. **Navigate to Dashboard**
4. **Test each feature**:
   - Upload a PDF
   - Configure options (if any)
   - Click the action button
   - Download should start automatically

### Expected Behavior

**Repair PDF**:
- Upload corrupted or normal PDF
- Downloads repaired version

**Protect PDF**:
- Upload PDF
- Enter password (min 4 characters)
- Set permissions checkboxes
- Downloads encrypted PDF

**PDF to Image**:
- Upload PDF
- Choose format (PNG/JPG/WebP)
- Downloads single image or ZIP (multi-page)

**ToWord/ToExcel**:
- Shows "Coming Soon" message
- Returns 501 status code

---

## Development Workflow

```
1. Make changes to code
2. Frontend: Auto-reloads (Vite HMR)
3. Backend: Restart server (or use nodemon)
4. Test in browser
```

### Using Nodemon (Auto-restart backend)
```bash
cd server
npm run dev  # Uses nodemon instead of node
```

---

## File Structure

```
Swift PDF/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── api.ts      # API config (uses localhost)
│   │   ├── pages/      # All PDF tool pages
│   │   └── components/
│   └── .env            # Not needed for dev
│
├── server/             # Express Backend
│   ├── server.js       # Main entry point
│   ├── routes/         # API routes
│   │   └── pdf.routes.js
│   ├── controllers/    # Business logic
│   │   └── pdfController.js
│   ├── middleware/     # Auth, upload, etc.
│   └── .env            # Required!
│
└── START_DEV.bat       # Quick start script
```

---

## Next Steps

Once local development is working:
1. Test all features thoroughly
2. Fix any bugs you find
3. When ready to deploy, follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## Need Help?

Check these files:
- `DEPLOYMENT_GUIDE.md` - For production deployment
- `server/server.js` - Backend configuration
- `client/src/api.ts` - Frontend API config
- Backend logs in terminal for errors
