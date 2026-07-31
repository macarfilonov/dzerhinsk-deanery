import logging
import json
import os
from datetime import datetime
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, MessageHandler, filters, CommandHandler, CallbackQueryHandler

# ==================== НАСТРОЙКИ ====================
TOKEN = "8064386594:AAHLk6pQ60qhPh5tnncrFv8z2PVexzx62mY"
ADMIN_PASSWORD = "Makar27.05.2014"
MESSAGES_FILE = "messages.json"

# ==================== ЛОГИРОВАНИЕ ====================
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# ==================== РАБОТА С ДАННЫМИ ====================
def load_messages():
    if os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except:
                return []
    return []

def save_messages(messages):
    with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)

def add_message(user_id, username, first_name, text):
    messages = load_messages()
    messages.append({
        "id": len(messages) + 1,
        "user_id": user_id,
        "username": username,
        "first_name": first_name,
        "text": text,
        "date": datetime.now().isoformat(),
        "answered": False,
        "answer": None,
        "answered_by": None,
        "answered_date": None
    })
    save_messages(messages)
    return len(messages)

def save_answer(message_id, answer_text, admin_username):
    messages = load_messages()
    for msg in messages:
        if msg["id"] == message_id:
            msg["answered"] = True
            msg["answer"] = answer_text
            msg["answered_by"] = admin_username
            msg["answered_date"] = datetime.now().isoformat()
            break
    save_messages(messages)

# ==================== ХРАНИЛИЩЕ СЕССИЙ ====================
admin_sessions = {}  # user_id -> True/False

# ==================== ОБРАБОТЧИКИ ====================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    await update.message.reply_text(
        "🙏 Здравствуйте! Это бот для обратной связи с Дзержинским благочинием.\n\n"
        "Отправьте ваше сообщение, и оно будет передано настоятелю.\n"
        "Храни вас Господь! ☦️"
    )

async def userlogin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    # Проверяем, что команда вызвана с паролем
    if len(context.args) == 0:
        await update.message.reply_text("❌ Введите пароль: /userlogin <пароль>")
        return
    
    password = context.args[0]
    if password == ADMIN_PASSWORD:
        admin_sessions[user.id] = True
        await update.message.reply_text(
            "✅ Вы успешно вошли в админ-панель.\n\n"
            "Используйте кнопки ниже для управления сообщениями.",
            reply_markup=get_admin_keyboard()
        )
    else:
        await update.message.reply_text("❌ Неверный пароль.")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    text = update.message.text

    # Сохраняем сообщение
    msg_id = add_message(
        user_id=user.id,
        username=user.username,
        first_name=user.first_name,
        text=text
    )

    # Отправляем подтверждение пользователю
    await update.message.reply_text(
        "✅ Ваше сообщение отправлено. Спасибо!\n\n"
        "Мы ответим вам в ближайшее время."
    )

    # Уведомляем администратора (если он онлайн)
    for admin_id in admin_sessions.keys():
        if admin_sessions[admin_id]:
            try:
                await context.bot.send_message(
                    chat_id=admin_id,
                    text=f"📩 Новое сообщение от @{user.username or user.first_name}\n\n{text[:100]}...",
                    reply_markup=InlineKeyboardMarkup([
                        [InlineKeyboardButton("📋 Перейти к списку", callback_data=f"view_messages")]
                    ])
                )
            except:
                pass

# ==================== АДМИН-ПАНЕЛЬ ====================
def get_admin_keyboard():
    keyboard = [
        [InlineKeyboardButton("📋 Просмотр сообщений", callback_data="view_messages")],
        [InlineKeyboardButton("📊 Статистика", callback_data="stats")],
        [InlineKeyboardButton("🚪 Выйти из админки", callback_data="logout")]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_messages_keyboard(page=0, per_page=5):
    messages = load_messages()
    total = len(messages)
    start_idx = page * per_page
    end_idx = min(start_idx + per_page, total)
    keyboard = []
    
    for msg in messages[start_idx:end_idx]:
        status = "✅" if msg["answered"] else "⏳"
        label = f"{status} #{msg['id']} от {msg['username'] or msg['first_name']}"
        keyboard.append([InlineKeyboardButton(label, callback_data=f"view_msg_{msg['id']}")])
    
    # Кнопки навигации
    nav_buttons = []
    if page > 0:
        nav_buttons.append(InlineKeyboardButton("◀️ Назад", callback_data=f"messages_page_{page-1}"))
    if end_idx < total:
        nav_buttons.append(InlineKeyboardButton("Вперед ▶️", callback_data=f"messages_page_{page+1}"))
    if nav_buttons:
        keyboard.append(nav_buttons)
    
    keyboard.append([InlineKeyboardButton("🔙 В админ-панель", callback_data="back_to_admin")])
    return InlineKeyboardMarkup(keyboard)

async def admin_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    user = query.from_user
    
    # Проверяем, авторизован ли пользователь
    if user.id not in admin_sessions or not admin_sessions[user.id]:
        await query.edit_message_text(
            "❌ У вас нет прав администратора. Используйте /userlogin <пароль>"
        )
        return

    data = query.data
    
    if data == "view_messages":
        messages = load_messages()
        if not messages:
            await query.edit_message_text(
                "📭 Нет сообщений.",
                reply_markup=InlineKeyboardMarkup([
                    [InlineKeyboardButton("🔙 Назад", callback_data="back_to_admin")]
                ])
            )
        else:
            total = len(messages)
            await query.edit_message_text(
                f"📋 Всего сообщений: {total}\n\n"
                f"✅ Отвеченных: {len([m for m in messages if m['answered']])}\n"
                f"⏳ Ожидают ответа: {len([m for m in messages if not m['answered']])}\n\n"
                f"Выберите сообщение для просмотра:",
                reply_markup=get_messages_keyboard(0)
            )
    
    elif data.startswith("messages_page_"):
        page = int(data.split("_")[2])
        await query.edit_message_reply_markup(
            reply_markup=get_messages_keyboard(page)
        )
    
    elif data.startswith("view_msg_"):
        msg_id = int(data.split("_")[2])
        messages = load_messages()
        msg = next((m for m in messages if m["id"] == msg_id), None)
        if not msg:
            await query.edit_message_text("❌ Сообщение не найдено.")
            return
        
        status = "✅ Отвечено" if msg["answered"] else "⏳ Ожидает ответа"
        text = (
            f"📩 Сообщение #{msg['id']}\n\n"
            f"👤 От: @{msg['username'] or msg['first_name']} (ID: {msg['user_id']})\n"
            f"📝 Текст: {msg['text']}\n"
            f"🕒 Дата: {msg['date']}\n"
            f"📌 Статус: {status}\n"
        )
        if msg["answered"]:
            text += f"\n💬 Ответ: {msg['answer']}\n"
            text += f"✍️ Ответил: {msg['answered_by']}\n"
            text += f"📅 Дата ответа: {msg['answered_date']}"
        
        keyboard = [
            [InlineKeyboardButton("💬 Ответить", callback_data=f"answer_{msg_id}")],
            [InlineKeyboardButton("🔙 К списку", callback_data="view_messages")],
            [InlineKeyboardButton("🏠 В админ-панель", callback_data="back_to_admin")]
        ]
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard))
    
    elif data.startswith("answer_"):
        msg_id = int(data.split("_")[1])
        context.user_data['answering'] = msg_id
        await query.edit_message_text(
            f"✏️ Введите текст ответа на сообщение #{msg_id}.\n\n"
            f"Просто отправьте текст сообщением.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("❌ Отмена", callback_data="view_messages")]
            ])
        )
    
    elif data == "stats":
        messages = load_messages()
        total = len(messages)
        answered = len([m for m in messages if m["answered"]])
        await query.edit_message_text(
            f"📊 Статистика\n\n"
            f"📩 Всего сообщений: {total}\n"
            f"✅ Отвечено: {answered}\n"
            f"⏳ Ожидает: {total - answered}\n"
            f"👥 Уникальных пользователей: {len(set(m['user_id'] for m in messages))}",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("🔙 Назад", callback_data="view_messages")]
            ])
        )
    
    elif data == "logout":
        admin_sessions[user.id] = False
        await query.edit_message_text(
            "👋 Вы вышли из админ-панели.",
            reply_markup=InlineKeyboardMarkup([
                [InlineKeyboardButton("🔑 Войти", callback_data="login")]
            ])
        )
    
    elif data == "back_to_admin":
        await query.edit_message_text(
            "🛠 Админ-панель",
            reply_markup=get_admin_keyboard()
        )
    
    elif data == "login":
        await query.edit_message_text(
            "🔑 Используйте команду /userlogin <пароль>"
        )

# Обработчик обычных текстовых сообщений для ответов администратора
async def handle_admin_reply(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if user.id not in admin_sessions or not admin_sessions[user.id]:
        await update.message.reply_text("❌ У вас нет прав администратора.")
        return
    
    if 'answering' not in context.user_data:
        return
    
    msg_id = context.user_data['answering']
    answer_text = update.message.text
    
    # Сохраняем ответ
    save_answer(msg_id, answer_text, user.username or user.first_name)
    
    # Отправляем ответ пользователю
    messages = load_messages()
    msg = next((m for m in messages if m["id"] == msg_id), None)
    if msg:
        try:
            await context.bot.send_message(
                chat_id=msg['user_id'],
                text=f"✝️ ОТВЕТ НАСТОЯТЕЛЯ:\n\n{answer_text}\n\nС уважением, Дзержинское благочиние."
            )
        except:
            pass
    
    context.user_data['answering'] = None
    await update.message.reply_text(
        f"✅ Ответ на сообщение #{msg_id} отправлен пользователю.",
        reply_markup=get_admin_keyboard()
    )

async def admin_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🔑 Вход в админку: /userlogin Makar27.05.2014\n"
        "📋 Команды:\n"
        "/start - начать\n"
        "/help - помощь\n"
        "/userlogin - вход в админ-панель"
    )

# ==================== ЗАПУСК ====================
def main():
    app = ApplicationBuilder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", admin_help))
    app.add_handler(CommandHandler("userlogin", userlogin))
    app.add_handler(CallbackQueryHandler(admin_callback))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_admin_reply), group=1)

    print("Бот запущен...")
    print("Для входа в админку используйте команду /userlogin Makar27.05.2014")
    app.run_polling()

if __name__ == "__main__":
    main()