# Telegram Bot - Kurs Sotish Platformasi

Telegram bot orqali Python va backend kurslarini sotish platformasi. Admin paneli bilan kurslarni boshqarish, to'lovlarni tasdiqlash va statistika ko'rish.

## Xususiyatlari

✅ Telegram bot bilan kurslar sotish
✅ Admin paneli (web)
✅ Supabase ma'lumotlar bazasi
✅ Click to'lov sistemasi
✅ To'lov tasdiqlovchi admin komandasi
✅ Foydalanuvchi statistikasi

## O'rnatish

```bash
npm install
```

## Konfiguratsiya

`.env` faylni tahrir qiling:

```env
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHANNEL_ID=your_channel_id
TELEGRAM_ADMIN_ID=your_admin_telegram_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_anon_key
CLICK_MERCHANT_ID=your_merchant_id
CLICK_MERCHANT_KEY=your_merchant_key
CLICK_SERVICE_ID=your_service_id
```

## Botni Ishga Tushirish

### Telegram Botni Ishga Tushirish
```bash
npm run bot
```

### Admin API Serverini Ishga Tushirish
```bash
npm run admin
```

### Hammasini Ishga Tushirish
```bash
npm run start
```

## Admin Panel

Admin panelini `admin.html`da oching:
- Kurslar qo'shish/o'chirish
- Xaridlarni ko'rish va tasdiqlovchi
- Foydalanuvchilar va statistika ko'rish

Parol: `admin123` (`.env`da o'zgartirishingiz mumkin)

## Bot Komandalar

### Foydalanuvchi Komandalar
- `/start` - Botni boshlash
- 📚 Kurslar ro'yxati
- 💳 Mening xaridlarim
- ❓ Yordam

### Admin Komandalar
- `/addcourse` - Kurs qo'shish
- `/deletecourse <course_id>` - Kurs o'chirish
- `/completepayment <transaction_id>` - To'lovni tasdiqlash

## Database Struktura

- `users` - Telegram foydalanuvchilar
- `courses` - Kurslar ro'yxati
- `purchases` - Xaridlar tarixchasi
- `admins` - Admin foydalanuvchilar

## To'lov Integratsiyasi

Hozirda Click API integratsiyasi tayyor. Konfiguratsiyani `.env`da o'rnatish kerak.

## Xavfsizlik Eslatmalari

- `.env` faylini Git'ga qo'shmaang
- Admin parolini o'zgartirib qo'ying
- Fayllarni maxfiy joyda saqlang
