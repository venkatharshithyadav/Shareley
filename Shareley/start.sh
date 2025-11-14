#!/bin/bash
# Start script for Shareley app

echo "🚀 Starting Shareley development server..."
echo ""

# Check if port 5173 is already in use
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5173 is already in use. Killing existing process..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    sleep 1
fi

# Start the dev server
echo "📦 Starting Vite dev server..."
npm run dev

