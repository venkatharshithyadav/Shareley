# 🚀 HOW TO RUN THE APP

## IMPORTANT: Follow these steps exactly

### Step 1: Make sure you're in the project directory
```bash
cd /Users/venkatharshith/Desktop/Venkat/shareley
```

### Step 2: Start the development server
```bash
npm run dev
```

### Step 3: Wait for the server to start
You should see this message:
```
VITE v7.0.6  ready in XXX ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Open your browser
**DO NOT click the link in the terminal!**

Instead:
1. Open your browser manually (Chrome, Firefox, Safari, etc.)
2. Type or paste this URL in the address bar: `http://localhost:5173`
3. Press Enter

### Step 5: Verify it's working
You should see:
- A pink/cyan gradient background
- "MZ Clothing" logo in the top navigation
- "Elevate Your Everyday Style" heading
- Featured products section
- About section
- Contact form
- Footer

## 🐛 Troubleshooting

### If you see a blank page:
1. **Check the browser console** (Press F12, then click "Console" tab)
2. Look for any red error messages
3. Common errors:
   - "Failed to load module" → Server might not be running
   - "Cannot GET /" → Server is not running
   - "Network error" → Server stopped

### If the server won't start:
1. Check if port 5173 is already in use:
   ```bash
   lsof -ti:5173
   ```
2. If it returns a number, kill that process:
   ```bash
   lsof -ti:5173 | xargs kill -9
   ```
3. Try starting again:
   ```bash
   npm run dev
   ```

### If styles are not loading:
1. Hard refresh the page:
   - Mac: Cmd + Shift + R
   - Windows/Linux: Ctrl + Shift + R
2. Clear browser cache
3. Check if `src/index.css` exists and contains: `@import "tailwindcss";`

### If you see "Cannot GET /":
- The server is not running
- Make sure you ran `npm run dev` first
- Check the terminal for any error messages

## ✅ Verification Checklist

- [ ] Server is running (you see the "ready" message)
- [ ] Browser is open
- [ ] URL is exactly: `http://localhost:5173`
- [ ] No errors in browser console (F12)
- [ ] Page loads with content (not blank)

## 📞 Still having issues?

1. Check the terminal where `npm run dev` is running for errors
2. Check browser console (F12) for JavaScript errors
3. Verify all dependencies are installed: `npm install`
4. Try rebuilding: `npm run build` then `npm run preview`

