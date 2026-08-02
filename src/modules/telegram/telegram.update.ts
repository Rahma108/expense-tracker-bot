import { Start, Update, Ctx, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UsersService } from '../users/users.service';

// Events in telegram ............
// 👋 Welcome to Expense Tracker Bot!

// Track your income and expenses easily.

// Available Commands:

// /register - Create your account
// /profile - View your profile
// /help - Show all commands
@Update()
export class TelegramUpdate {
        constructor(
            private readonly usersService: UsersService,
        ) {}
            @Start()
            async start(@Ctx() ctx: Context) {
            return this.usersService.start(ctx);
            }

            // @Command('register')
            // async register(@Ctx() ctx: Context) {
            // return this.usersService.register(ctx);
            // }
}
