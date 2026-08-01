import { Start, Update, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';

// Events in telegram ............
@Update()
export class TelegramUpdate {
    @Start()
    async start(@Ctx() ctx: Context) {
        await ctx.reply('👋 Welcome to Expense Tracker Bot!');
    }
}
