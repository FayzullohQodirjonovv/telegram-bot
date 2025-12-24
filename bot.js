require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// --- 1. ULANISHLAR ---
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SUPABASE_ANON_KEY
);

// AI ni xavfsizlik cheklovlarisiz sozlash (bu "band" xatosini kamaytiradi)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
});

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const ADMIN_ID = parseInt(process.env.TELEGRAM_ADMIN_ID);

// --- 2. MENYULAR ---
const getMainMenu = () => Markup.keyboard([
    ['📚 Kurslar ro\'yxati', '💳 Mening xaridlarim'],
    ['❓ Yordam']
]).resize();

const getBackMenu = () => Markup.keyboard([
    ['⬅️ Orqaga', '🔝 Asosiy Menyu']
]).resize();

// --- 3. BOT LOGIKASI ---

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const userName = ctx.from.username || ctx.from.first_name;

    await supabase.from('users').upsert({ id: userId, username: userName, status: 'active' });

    await ctx.reply(`👋 Xush kelibsiz, ${ctx.from.first_name}!\nSavolingizni yozing yoki menyudan foydalaning.`, getMainMenu());
});

// Kurslar ro'yxati
bot.hears('📚 Kurslar ro\'yxati', async (ctx) => {
    const { data: courses, error } = await supabase.from('courses').select('*');
    
    if (error || !courses || courses.length === 0) {
        return ctx.reply('⚠️ Hozircha kurslar mavjud emas.', getBackMenu());
    }

    let message = '📚 <b>Mavjud kurslar:</b>\n\n';
    const buttons = courses.map(c => [Markup.button.callback(`Sotib olish: ${c.title}`, `buy_${c.id}`)]);

    await ctx.reply('Kursni tanlang:', getBackMenu());
    await ctx.reply(message, { parse_mode: 'HTML', ...Markup.inlineKeyboard(buttons) });
});

bot.hears(['⬅️ Orqaga', '🔝 Asosiy Menyu'], (ctx) => {
    ctx.reply('Asosiy menyudasiz:', getMainMenu());
});

// --- 4. AI CHAT (Xatoliklarni aniq ko'rsatuvchi qism) ---

bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    const menuButtons = ['📚 Kurslar ro\'yxati', '💳 Mening xaridlarim', '❓ Yordam', '⬅️ Orqaga', '🔝 Asosiy Menyu'];

    if (menuButtons.includes(text)) return;

    try {
        await ctx.sendChatAction('typing');
        
        // AI ga yuborish
        const result = await aiModel.generateContent(text);
        const response = await result.response;
        const aiText = response.text();
        
        await ctx.reply(aiText);

    } catch (error) {
        console.error("🔴 AI XATOSI:", error.message);
        
        // Agar xato mintaqa bilan bog'liq bo'lsa
        if (error.message.includes("location") || error.message.includes("supported")) {
            ctx.reply("🤖 Google AI O'zbekiston IP-manzilini cheklamoqda. Iltimos, serverda VPN yoqing.");
        } else {
            ctx.reply(`🤖 AI Xatosi: ${error.message}`);
        }
    }
});

// --- 5. ADMIN KOMANDALARI ---
bot.command('addcourse', async (ctx) => {
    if (ctx.from.id !== ADMIN_ID) return;
    const parts = ctx.message.text.split('|').map(p => p.trim());
    if (parts.length < 4) return ctx.reply('Format: /addcourse | Nom | Tavsif | Narx');

    const { error } = await supabase.from('courses').insert({
        title: parts[1], description: parts[2], price: parseInt(parts[3])
    });
    ctx.reply(error ? 'Xato: ' + error.message : '✅ Kurs qo\'shildi!');
});

// Xatoliklarni ushlash
bot.catch((err) => console.error('Bot Error:', err));

bot.launch().then(() => console.log('✅ Bot ishga tushdi!'));