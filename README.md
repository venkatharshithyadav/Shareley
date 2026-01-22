# Shareley - AI powered Clothing Website

A modern, responsive clothing website built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Development Server

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

**Important**: Make sure the server is running before opening the URL. The terminal will show:
```
➜  Local:   http://localhost:5173/
```

### Alternative: Use the Start Script

You can also use the provided start script:
```bash
./start.sh
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🛠️ Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 🐛 Troubleshooting

### Server not starting?
- Make sure port 5173 is not in use: `lsof -ti:5173`
- Kill any existing process: `lsof -ti:5173 | xargs kill -9`

### Blank page in browser?
1. Check browser console for errors (F12)
2. Make sure the dev server is running
3. Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
4. Clear browser cache

### Build errors?
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version: `node --version` (should be v18+)

## 📝 Notes

- The app uses Tailwind CSS v4 with the new `@import "tailwindcss"` syntax
- PostCSS and Tailwind configs are in ES module format
- The development server uses Vite's HMR (Hot Module Replacement) for fast updates
