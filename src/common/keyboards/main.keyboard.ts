import { Markup } from "telegraf";


export const MAIN_MENU_KEYBOARD = 
Markup.keyboard([
    [
        "💰 Add Expense",
        "📷 Scan Receipt",
    ],
    [
        "📊 Report",
        "📈 Statistics",
    ],
    [
        "🤖 AI Insights",
        "🔮 Forecast",
    ],
    [
        "📂 Categories",
        "👤 Profile",
    ],
    [
        "❓ Help",
        "❌ Cancel",
    ],
])
.resize();