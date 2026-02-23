# 📝 Content Editing Guide

## Main File to Edit: `src/App.tsx`

This is the **ONLY file** you need to edit to change all webpage content!

---

## 🗺️ Content Map - Where to Find Everything

### 1. **Navigation Bar** (Lines 8-28)
- **Line 16**: Brand name (currently "MZ Clothing")
- **Line 19**: "Collections" link text
- **Line 20**: "About" link text  
- **Line 21**: "Contact" link text
- **Line 23**: "Shop Now" button text

### 2. **Hero Section** (Lines 30-57)
- **Line 40**: Main heading (currently "Elevate Your Everyday Style")
- **Line 43**: Description text
- **Line 47**: "Shop New Arrivals" button text
- **Line 51**: "View Collections" button text

### 3. **Featured Products Section** (Lines 59-97)
- **Line 69**: Section heading (currently "Featured")
- **Line 70**: Section description
- **Line 86**: Product name (currently "Product {i}")
- **Line 87**: Product description
- **Line 89**: Product price (currently "$49.00")

### 4. **About Section** (Lines 99-131)
- **Line 109**: Section heading (currently "About MZ Clothing")
- **Line 110**: Section description
- **Line 113**: Feature titles (currently "Responsibly Made", "Comfort Fit", "Timeless Design")
- **Line 126**: Feature descriptions

### 5. **Contact Section** (Lines 133-158)
- **Line 143**: Section heading (currently "Get in Touch")
- **Line 144**: Section description
- **Line 149-153**: Form input placeholders
- **Line 154**: Submit button text

### 6. **CTA Section** (Lines 160-181)
- **Line 169**: Heading text
- **Line 172**: Description text
- **Line 176**: Button text

### 7. **Footer** (Lines 182-225)
- **Line 190**: Brand name in footer
- **Line 193**: Footer description
- **Line 197-218**: Footer links and sections
- **Line 222**: Copyright text

---

## 🎯 Quick Edit Examples

### Change Brand Name
**Find**: `MZ Clothing` (appears on lines 16, 43, 109, 190, 222)
**Replace with**: Your brand name

### Change Main Heading
**Line 40**: Change `Elevate Your Everyday Style` to your heading

### Change Button Text
**Line 47**: Change `Shop New Arrivals` to your button text
**Line 51**: Change `View Collections` to your button text

### Add More Products
**Line 73**: Change `[1,2,3]` to `[1,2,3,4,5]` to show 5 products instead of 3

### Change Prices
**Line 89**: Change `$49.00` to your price

---

## ⚠️ Important Notes

1. **Don't delete** the comment lines (lines starting with `{/*` and ending with `*/}`)
2. **Keep the quotes** around text: `"Your Text Here"`
3. **Save the file** after editing - Vite will automatically reload!
4. **Check the browser** at `http://localhost:5173` to see your changes

---

## 📋 Browser Title (Optional)

To change the browser tab title, also edit:
- **File**: `index.html`
- **Line 8**: Change `<title>Shareley</title>` to your title

---

## 💡 Tips

- **Save frequently** - Changes appear instantly in the browser
- **Keep the structure** - Don't delete important code like `className`, `{`, `}`, etc.
- **Test in browser** - Always check how it looks after editing
- **Backup first** - Copy the file before making big changes

---

## 🚀 Ready to Edit?

1. Open `src/App.tsx` in your editor
2. Find the text you want to change using the line numbers above
3. Edit the text inside the quotes
4. Save the file
5. Check your browser - changes appear automatically!

