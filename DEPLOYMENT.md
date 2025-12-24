# Telegram Bot Deployment Qo'llanmasi

## 🚀 Quick Start

```bash
# 1. Dependencies o'rnatish
npm install

# 2. .env faylini konfiguratsiya qilish (SETUP.md'ni o'qing)
# Telegram token, channel ID, admin ID larini o'rnatting

# 3. Bot'ni ishga tushirish
npm start
```

## 📋 Komponentlar

### 1. **Telegram Bot** (`bot.js`)
- Foydalanuvchi ro'yxatini boshqaradi
- Kurslar katalogini ko'rsatadi
- To'lov so'rovlarini qabul qiladi
- Admin komandalarini bajaradi

**Komandalar:**
- `/start` - Botni boshlash
- `/addcourse` - Kurs qo'shish (admin)
- `/deletecourse` - Kurs o'chirish (admin)
- `/completepayment` - To'lovni tasdiqlash (admin)

### 2. **Admin API** (`admin-server.js`)
Port: `3001`

**Endpoints:**
- `POST /api/login` - Admin kirishl
- `GET /api/courses` - Kurslar ro'yxati
- `POST /api/courses` - Yangi kurs
- `PUT /api/courses/:id` - Kurs tahrir
- `DELETE /api/courses/:id` - Kurs o'chirish
- `GET /api/purchases` - Xaridlar
- `PUT /api/purchases/:id/complete` - To'lov tasdiqlash
- `GET /api/users` - Foydalanuvchilar
- `GET /api/analytics` - Statistika

### 3. **Admin Web** (`serve-admin.js`)
Port: `3000`

Beautiful web dashboard:
- 📊 Statistika (daromad, foydalanuvchilar, kurslar)
- 📚 Kurslar boshqaruvi
- 💳 Xaridlarni tasdiqlash
- 👥 Foydalanuvchilar ro'yxati

### 4. **Edge Function** (Click Payment)
Supabase Edge Function - Click to'lov sistemasi integratsiyasi

## 🗄️ Database

### Users Table
```sql
- id (bigint, primary key) - Telegram ID
- username (text)
- phone (text)
- status (text) - pending/active/blocked
- subscribed_to_channel (boolean)
- created_at, updated_at (timestamps)
```

### Courses Table
```sql
- id (uuid, primary key)
- title (text)
- description (text)
- price (integer) - som'da
- file_url (text) - optional
- created_at, updated_at (timestamps)
```

### Purchases Table
```sql
- id (uuid, primary key)
- user_id (bigint) - references users
- course_id (uuid) - references courses
- payment_status (text) - pending/completed/failed
- transaction_id (text, unique)
- amount (integer)
- created_at, updated_at (timestamps)
```

### Admins Table
```sql
- id (uuid, primary key)
- telegram_id (bigint, unique)
- username (text)
- created_at (timestamp)
```

## 🌐 Production Deployment

### Option 1: Render.com (Recommended)
```bash
# Render'da yangi Web Service yarating
# Git repo linkini qo'shing
# Environment variables'ni o'rnatting
# Deploy
```

### Option 2: Railway.app
```bash
# Railway dashboard'ga kiring
# GitHub'dan repo qo'shing
# ENV variables'ni o'rnatting
# Deploy
```

### Option 3: Heroku
```bash
# heroku login
# heroku create your-app-name
# git push heroku main
```

### Option 4: VPS (DigitalOcean/Linode)
```bash
# 1. Server setup
ssh root@your_server

# 2. Node o'rnatish
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Code joylashtirish
git clone your_repo
cd your_repo
npm install

# 4. PM2 bilan background'da ishga tushirish
npm install -g pm2
pm2 start bot.js --name "bot"
pm2 start admin-server.js --name "admin-api"
pm2 start serve-admin.js --name "admin-web"
pm2 save
pm2 startup

# 5. Nginx konfiguratsiyasi
# Admin panelini 3000 portda expose qiling
```

## 🔒 Security Best Practices

1. **Tokenlarni Himoya Qiling**
   - `.env` faylini git'aga qo'shmaang
   - Environment variables ishlatting
   - Production'da separate secrets mantikasi

2. **Admin Parolini O'zgartiring**
   - `config.js`da `ADMIN_PASSWORD` = 'admin123' ni o'zgartiring
   - Murakkab parol yarating

3. **API Rate Limiting**
   - Express Rate Limiting qo'shing
   - DDoS hujumlardan himoya

4. **HTTPS Ishlatting**
   - SSL sertifikat oling
   - Barcha trafikni HTTPS'ga yo'naltiring

5. **Database Backup**
   - Regular backup'lar oling
   - Disaster recovery plan yarating

## 📱 Bot Webhook Setup (Advanced)

Production'da polling o'rniga webhooks ishlatting:

```javascript
// bot.js'da o'zgartirish
// bot.launch() o'rniga:
await bot.telegram.setWebhook(`https://your-domain.com/webhook`);
```

## 📊 Monitoring

```bash
# Bot logs
pm2 logs bot

# API logs
pm2 logs admin-api

# Web logs
pm2 logs admin-web

# PM2 Dashboard
pm2 monit
```

## 🐛 Troubleshooting

### Bot javob bermaydi
```bash
# Tokenni tekshiring
# Supabase ulanishini tekshiring
# Bot'u BotFather'dan ishga tushkanligini tekshiring
```

### Admin panelga kira olmayapman
```bash
# Port 3000 ochiq ekanligini tekshiring
# API port 3001 ochiq ekanligini tekshiring
# Parolni tekshiring (admin123)
```

### Database ulanish xatosi
```bash
# Supabase URL'ni tekshiring
# Anon Key'ni tekshiring
# Connection limite'ni ko'ring
```

## 📞 Support

- Bot bugs: @kadirjanoff_dev
- Admin panel issues: code review qiling
- Database issues: Supabase docs'ni o'qing

## 🎉 Tugallandi!

Bot va admin panel ishga tushdi. Kurslarni qo'shishni boshlang!

```bash
# Bot'ga /start yuboring
# Admin panel'ga http://localhost:3000 orqali kiring
# Birinchi kursni qo'shing
# To'lovlarni qayta boshing!
```
