#!/bin/bash

# Telegram Mini App Deployment Script

echo "🚀 Deploying Telegram Mini App..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Deployment Options:"
    echo "1. Netlify: Push to GitHub and connect to Netlify"
    echo "2. Vercel: vercel --prod"
    echo "3. GitHub Pages: Enable in repository settings"
    echo "4. Custom server: Upload 'dist' folder to your server"
    echo ""
    echo "📱 After deployment:"
    echo "1. Copy your deployment URL"
    echo "2. Open BotFather in Telegram"
    echo "3. Send: /setmenubutton"
    echo "4. Select your bot"
    echo "5. Paste your deployment URL"
    echo ""
    echo "✅ Your Telegram Mini App is ready!"
else
    echo "❌ Build failed!"
    exit 1
fi 