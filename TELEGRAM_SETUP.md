# Telegram Mini App Setup Guide

## Overview
This food ordering app has been converted to a Telegram Mini App that integrates with your Telegram bot for order management.

## Configuration

### Bot Settings
- **Bot Token**: `7963409900:AAEkKalsUPkRbFq04ofgILuJqY8fUYxXspA`
- **Your Chat ID**: `1823225052`

### How It Works
1. **Order Placement**: When users complete an order, the app sends a detailed order notification to your chat
2. **User Data**: The app automatically uses Telegram user data when available
3. **Native UI**: Uses Telegram's native UI elements (MainButton, BackButton, alerts, haptic feedback)

## Features

### Telegram Integration
- ✅ **Auto-filled user data**: Username from Telegram profile
- ✅ **Native UI**: Telegram MainButton for checkout
- ✅ **Haptic feedback**: Tactile responses for all interactions
- ✅ **Native alerts**: Uses Telegram's alert system
- ✅ **Back button**: Native Telegram back button support

### Order Management
- ✅ **Order notifications**: Detailed order info sent to your chat
- ✅ **Customer details**: Full contact information included
- ✅ **Order tracking**: Unique order IDs for each order
- ✅ **Delivery/Pickup**: Support for both order types

## Setting Up the Mini App

### 1. Deploy the App
Deploy this app to a hosting service (like Vercel, Netlify, or your own server) to get a public URL.

### 2. Configure the Bot
1. Open your bot chat with BotFather
2. Use `/setmenubutton` command
3. Select your bot
4. Set the menu button URL to your deployed app URL

### 3. Test the Integration
1. Open your bot in Telegram
2. Tap the menu button to open the Mini App
3. Place a test order
4. Check that you receive the order notification

## Order Notification Format

When an order is placed, you'll receive a message like this:

```
🍽️ New Order Received!

📋 Order ID: ORD-ABC123
🕐 Time: 2024-01-15 14:30:00

👤 Customer Information:
Name: John Doe
Telegram: @johndoe
Phone: +1 (555) 123-4567
User ID: 123456789

📦 Order Type: 🚚 Delivery
📍 Delivery Address: 123 Main St, City, State 12345

🛒 Items Ordered:
1. 🍕 Margherita Pizza
   💰 $12.99 × 2 = $25.98
2. 🍔 Classic Burger
   💰 $8.99 × 1 = $8.99

💳 Total Amount: $34.97

🔔 Please contact the customer to confirm the order and provide delivery details.
```

## Development

### Run Locally
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

## Troubleshooting

### Common Issues

1. **Orders not being received**
   - Check that the bot token is correct
   - Verify your chat ID is correct
   - Ensure the bot can send messages to your chat

2. **Telegram features not working**
   - Make sure the app is opened within Telegram
   - Check that the Telegram WebApp script is loaded
   - Verify the app URL is set correctly in BotFather

3. **User data not populated**
   - User data is only available when opened in Telegram
   - Some users may have privacy settings that prevent data sharing

### Support
If you encounter issues, check:
- Console errors in the browser developer tools
- Network requests to the Telegram Bot API
- Bot permissions and settings in BotFather 