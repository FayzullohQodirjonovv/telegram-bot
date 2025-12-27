require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/* =======================
   1. ULANISHLAR
======================= */

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/* =======================
   2. MENYULAR
======================= */

const mainMenu = Markup.keyboard([
    ['📚 Interview Testlar', '📂 Fayzulloh portfolio'],
    ['❓ Yordam']
]).resize();

const backMenu = Markup.keyboard([
    ['⬅️ Orqaga', '🔝 Asosiy Menyu']
]).resize();

/* =======================
   3. START
======================= */

bot.start(async (ctx) => {
    await supabase.from('users').upsert({
        id: ctx.from.id,
        username: ctx.from.username || ctx.from.first_name
    });

    ctx.reply(
        `👋 Xush kelibsiz, ${ctx.from.first_name}!\nFrontend interviewga tayyormisiz?`,
        mainMenu
    );
});

/* =======================
   4. INTERVIEW MENYU
======================= */

bot.hears('📚 Interview Testlar', (ctx) => {
    ctx.reply(
        '🧠 Frontend Interview Testlarini tanlang:',
        Markup.inlineKeyboard([
            [Markup.button.callback('🟨 JavaScript', 'test_js')],
            [Markup.button.callback('🟦 TypeScript', 'test_ts')],
            [Markup.button.callback('⚛️ React', 'test_react')],
            [Markup.button.callback('▲ Next.js', 'test_next')]
        ])
    );
});

/* =======================
   5. JAVASCRIPT TEST
======================= */

bot.action('test_js', (ctx) => {
    ctx.reply(
`🟨 <b>JavaScript Interview Test</b>

1️⃣ Closure nima?
A) Loop  
B) Function tashqi scope’ni eslab qolishi ✅  
C) Async funksiya  
D) Callback

2️⃣ == va === farqi?
A) Farqi yo‘q  
B) === type ham tekshiradi ✅  
C) == tezroq  
D) === faqat number

3️⃣ Hoisting nima?
A) Event  
B) O‘zgaruvchi va functionlarni yuqoriga ko‘tarish ✅  
C) Garbage  
D) Async

4️⃣ Event Loop vazifasi?
A) DOM  
B) Async queue boshqarish ✅  
C) API  
D) Memory`,
        { parse_mode: 'HTML', ...backMenu }
    );
});

/* =======================
   6. TYPESCRIPT TEST
======================= */

bot.action('test_ts', (ctx) => {
    ctx.reply(
`🟦 <b>TypeScript Interview Test</b>

1️⃣ type va interface farqi?
A) Farqi yo‘q  
B) Interface extend, type union qiladi ✅  
C) type faqat object  
D) interface primitive

2️⃣ any va unknown?
A) Bir xil  
B) unknown xavfsizroq ✅  
C) any yaxshi  
D) unknown ishlamaydi

3️⃣ Generics nima?
A) Class  
B) Dynamic type yozish imkoniyati ✅  
C) Enum  
D) Decorator

4️⃣ enum nima?
A) Funksiya  
B) Constant qiymatlar to‘plami ✅  
C) Hook  
D) API`,
        { parse_mode: 'HTML', ...backMenu }
    );
});

/* =======================
   7. REACT TEST
======================= */

bot.action('test_react', (ctx) => {
    ctx.reply(
`⚛️ <b>React Interview Test</b>

1️⃣ Virtual DOM nima?
A) Browser DOM  
B) React DOM nusxasi ✅  
C) HTML  
D) CSS

2️⃣ useEffect qachon ishlaydi?
A) Renderdan oldin  
B) Renderdan keyin ✅  
C) Clickda  
D) Mount bo‘lmaydi

3️⃣ Controlled component?
A) State bilan boshqariladi ✅  
B) Props yo‘q  
C) Class component  
D) CSS bilan

4️⃣ Key prop nima uchun?
A) Style  
B) List performance uchun ✅  
C) Event  
D) API`,
        { parse_mode: 'HTML', ...backMenu }
    );
});

/* =======================
   8. NEXT.JS TEST
======================= */

bot.action('test_next', (ctx) => {
    ctx.reply(
`▲ <b>Next.js Interview Test</b>

1️⃣ Next.js nima?
A) CSS framework  
B) React framework ✅  
C) Backend  
D) Database

2️⃣ getStaticProps?
A) SSR  
B) SSG uchun ✅  
C) CSR  
D) Middleware

3️⃣ App Router qachon chiqdi?
A) v10  
B) v12  
C) v13 ✅  
D) v14

4️⃣ Image optimization?
A) Yo‘q  
B) next/image orqali ✅  
C) CSS  
D) HTML`,
        { parse_mode: 'HTML', ...backMenu }
    );
});

/* =======================
   9. PORTFOLIO
======================= */

bot.hears('📂 Fayzulloh portfolio', (ctx) => {
    ctx.reply(
`👨‍💻 <b>Fayzulloh Qodirjonov</b>
Frontend Developer

🚀 React & Next.js mutaxassisi

📞 93 541 5474
📧 fqodirjonov1@gmail.com
🌐 GitHub: https://github.com/FayzullohQodirjonovv

JavaScript, TypeScript, React, Next.js, Tailwind, Ant Design bilan ishlayman.
CRM, Online Shop, Portfolio va AI botlar yaratganman.

© 2025 Fayzulloh Qodirjonov`,
        { parse_mode: 'HTML', ...backMenu }
    );
});

/* =======================
   10. YORDAM
======================= */

bot.hears('❓ Yordam', (ctx) => {
    ctx.reply(
`🆘 Yordam

📩 Admin bilan aloqa:
👉 @kadirjanof_dev`,
        backMenu
    );
});

/* =======================
   11. ORQAGA
======================= */

bot.hears(['⬅️ Orqaga', '🔝 Asosiy Menyu'], (ctx) => {
    ctx.reply('Asosiy menyu:', mainMenu);
});

/* =======================
   12. AI CHAT
======================= */

bot.on('text', async (ctx) => {
    try {
        const res = await aiModel.generateContent(ctx.message.text);
        ctx.reply(res.response.text());
    } catch {
        ctx.reply('🤖 AI vaqtincha ishlamayapti');
    }
});

/* =======================
   13. LAUNCH
======================= */

bot.launch();
console.log('✅ Frontend Interview Bot ishga tushdi (24/7)');
