require('dotenv').config();

module.exports = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    channelId: process.env.TELEGRAM_CHANNEL_ID,
    adminId: parseInt(process.env.TELEGRAM_ADMIN_ID),
  },
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  click: {
    apiUrl: process.env.CLICK_API_URL,
    merchantId: process.env.CLICK_MERCHANT_ID,
    merchantKey: process.env.CLICK_MERCHANT_KEY,
    serviceId: process.env.CLICK_SERVICE_ID,
  },
  admin: {
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },
  server: {
    apiPort: 3001,
    webPort: 3000,
  }
};
