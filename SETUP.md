# Telegram Bot Kurs Sotish Platformasi - Setup Qo'llanmasi

## 1️⃣ Telegram Bot Tayyorlash

1. [@BotFather](https://t.me/botfather) bilan suhbat oching
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting (misol: KadirjanoffBot)
4. Username kiriting (misol: kadirjanoff_bot)
5. Olingan **TOKEN**ni `.env` fayliga `TELEGRAM_BOT_TOKEN` ga o'rnatting

## 2️⃣ Telegram Kanalini Tayyorlash

1. Yangi kanal yarating (yoki mavjud kanaldan foydalaning)
2. Bot'ni kanalga admin qilip qo'shing
3. Kanal **ID**sini `.env` fayliga `TELEGRAM_CHANNEL_ID` ga o'rnatting
   - Kanal ID sini topish: `/getidsbot` bilan @userinfobot'dan foydalaning

## 3️⃣ Admin ID'sini Topish

1. Bot'ni ishga tushiring: `npm run bot`
2. Bot'ga `/start` yuboring
3. @userinfobot dan o'z **User ID**'ingizni oling
4. `.env` fayliga `TELEGRAM_ADMIN_ID` ga o'rnatting

## 4️⃣ Click API Konfiguratsiyasi (ixtiyoriy)

Click to'lov tizimi uchun:
1. Click.uz dashboard'iga kiring
2. Merchant keysalarini oling
3. `.env`ga qo'shning:
   ```
   CLICK_MERCHANT_ID=xxx
   CLICK_MERCHANT_KEY=xxx
   CLICK_SERVICE_ID=xxx
   ```

## 5️⃣ .env Faylini Tekshiring

```env
# Telegram
TELEGRAM_BOT_TOKEN=8142396075:AAELTcbp5AlQAhDONfBkKHlrJvEq-NgeLZQ
TELEGRAM_CHANNEL_ID=-1002497832856
TELEGRAM_ADMIN_ID=1234567890

# Supabase (avval tayyorlangan)
VITE_SUPABASE_URL=https://zhximrlgyanajztvwrfx.supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=eyJh...

# Click (ixtiyoriy)
CLICK_MERCHANT_ID=your_merchant_id
CLICK_MERCHANT_KEY=your_merchant_key
CLICK_SERVICE_ID=your_service_id
```

## 6️⃣ Bot'ni Ishga Tushirish

### Hammasi bir vaqtada:
```bash
npm start
```

### Alohida alohida:
```bash
# Terminal 1 - Bot
npm run bot

# Terminal 2 - Admin API
npm run admin-api

# Terminal 3 - Admin Web
npm run admin-web
```

## 7️⃣ Admin Panel'ga Kirish

1. Brauzerda oching: `http://localhost:3000`
2. Parol: `admin123`
3. Kurslar qo'shishni boshlang!

## 8️⃣ Birinchi Kurs Qo'shish

### Web Admin Panel orqali:
1. "📚 Kurslar" tabini oching
2. Kurs nomi, tavsif, narxni kiriting
3. "➕ Kurs Qo'shish" tugmasini bosing

### Bot orqali (Admin uchun):
```
/addcourse
Python Backend - Asoslar
Pyton bilan backend development o'rganish
300000
```

## 9️⃣ To'lovlarni Tasdiqlash

### Web Admin Panel:
1. "💳 Xaridlar" tabini oching
2. "Pendgi" to'lovlarni "✓ Tasdiqlash" tugmasi bilan tasdiqlang
3. Foydalanuvchiga avtomatik bildiriladi

### Bot orqali:
```
/completepayment TXN_1234567890_abcd
```

## 🔟 Foydalanuvchi Oqimi

1. Foydalanuvchi `/start` yubor adi
2. Kanal obunasini tekshiriladi
3. Kurslar ro'yxatini ko'radi
4. Kursni tanlab, to'lov ID'sini oladi
5. Admin to'lovni tasdiqladi
6. Fayilni yuklab oladi

## 📱 Kanalga Qo'shilish Tekshiruvini O'zgartirish

Foydalanuvchilar to'g'ridan-to'g'ri xarid qila bilishlari uchun kanal tekshiruvini o'zgartirishingiz mumkin:

`bot.js` da:
```javascript
// 45-satr ko'ring - kanal tekshiruvini o'chirib qo'ysangiz
if (!isMember) {
  // Bu kodlarni o'chirib qo'ysangiz kanal tekshiruvi yo'q bo'ladi
}
```

## ⚠️ Muhim

- `.env` faylini Git'ga qo'shmaang
- Admin parolini va tokenlarni maxfiy saqlang
- Bot'ni 24/7 ishlatib turishni xohlasangiz, serverga joylashtiring
- Regular back-up olishni unutmaang

## Masalalarni Hal Qilish

### Bot javob bermaydi
- Tokenni tekshiring
- Supabase ulanishini tekshiring
- `npm run bot` dan keyin konsolni ko'ring

### Admin panelga kira olmayapman
- API port'u (3001) ochiq ekanligini tekshiring
- `npm run admin-api` ishga tushganligini tekshiring

### Kanalga qo'shilishni tekshiruvi ishlamaydi
- Kanal ID'sini tekshiring (manfiy raqam bo'lishi kerak)
- Bot'u kanal adminligi bo'lishi kerak

## Qo'shimcha Yordam

- @kadirjanoff_dev bilan bog'lanish
- README.md'ni o'qing
