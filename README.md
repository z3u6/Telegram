# Selfie → Telegram

This project uses a browser camera and a serverless API to send a photo to your Telegram bot.

## Important
The page explicitly asks for camera permission and requires the visitor to press "Take & Send Photo".
Do not use it to secretly capture or upload someone's image.

## Deploy with Vercel

1. Create a Telegram bot with @BotFather.
2. Get the bot token.
3. Send a message to your bot.
4. Find your chat ID (instructions below).
5. Put this project in a GitHub repository.
6. Import the repository into Vercel.
7. In Vercel Project Settings → Environment Variables, add:
   TELEGRAM_BOT_TOKEN = your bot token
   TELEGRAM_CHAT_ID = your chat ID
8. Redeploy.

## Get chat ID

After starting your bot and sending it a message, open:

https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates

Look for:
"chat":{"id":123456789,...

The number is your TELEGRAM_CHAT_ID.

Never publish your bot token.

## Local install

npm install
npm run dev

For local testing, set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in your environment.

## Files

public/index.html = camera page
api/upload.js = server-side Telegram upload
package.json = dependency
