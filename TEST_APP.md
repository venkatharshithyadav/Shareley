# Testing the App

## Step-by-Step Instructions

1. **Open Terminal** in the project directory:
   ```bash
   cd /Users/venkatharshith/Desktop/Venkat/shareley
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Wait for the server to start**. You should see:
   ```
   VITE v7.0.6  ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```

4. **Open your browser** (Chrome, Firefox, Safari, etc.)

5. **Navigate to**: `http://localhost:5173`

6. **If you see a blank page**:
   - Press F12 (or Cmd+Option+I on Mac) to open Developer Tools
   - Go to the "Console" tab
   - Look for any red error messages
   - Take a screenshot and check what the error says

7. **If the page loads but looks broken**:
   - Check the Console tab for errors
   - Check the Network tab to see if files are loading
   - Try a hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## Common Issues

### Issue: "Cannot GET /" or "404 Not Found"
**Solution**: Make sure the dev server is running. The terminal should show the server is ready.

### Issue: Blank white page
**Solution**: 
1. Open browser console (F12)
2. Check for JavaScript errors
3. Make sure all dependencies are installed: `npm install`

### Issue: Server won't start
**Solution**:
1. Check if port 5173 is in use: `lsof -ti:5173`
2. Kill any existing process: `lsof -ti:5173 | xargs kill -9`
3. Try again: `npm run dev`

### Issue: Styles not loading
**Solution**:
1. Clear browser cache
2. Hard refresh: Cmd+Shift+R or Ctrl+Shift+R
3. Check if `src/index.css` exists and contains `@import "tailwindcss";`

## Verification

The app should display:
- A navigation bar at the top with "MZ Clothing" logo
- A hero section with "Elevate Your Everyday Style"
- Featured products section
- About section
- Contact form
- Footer

If you see all of these, the app is working correctly!

