import { Start, Update, Ctx,  On, Command, Action, Hears } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationRouterService } from '../conversation/conversation-router.service';
import { ConversationState } from '../../common/enums';
import { CATEGORY_MESSAGES, EXPENSE_MESSAGES } from '../../common/messages';
import { ExpensesService } from '../expenses/expense.service';
import { CategoriesService } from '../categories/categories.service';
import { ReportsService } from '../reports/reports.service';
import { ExportService } from '../export/export.service';
import { RedisKeys, RedisService } from '../../redis/redis.service';
import { UserRepository } from '../../common/repository';
import { VoiceExpenseHandler } from '../conversation/handlers/voice-expense.handler';

// Events in telegram ............

@Update()
@Injectable()
export class TelegramUpdate {
       constructor(
            private readonly usersService: UsersService,
            private readonly conversationRouter: ConversationRouterService,
            private readonly conversationService: ConversationService,
            private readonly expensesService: ExpensesService,
            private readonly categoriesService: CategoriesService,
            private readonly reportsService: ReportsService,
            private readonly exportService: ExportService,
            private readonly redisService: RedisService,
            private readonly usersRepository: UserRepository,
                private readonly voiceExpenseHandler: VoiceExpenseHandler,
        ) {}
            @Start()
            async start(@Ctx() ctx: Context) {
            return this.usersService.start(ctx);
            }
            @Command('register')
                async register(@Ctx() ctx: Context) {
                    return this.usersService.register(ctx);
                }

            @Command('profile')
                async profile(@Ctx() ctx: Context) {

                return this.usersService.profile(ctx);
                }
            @Command('help')
            async help(@Ctx() ctx: Context) {
            return this.usersService.help(ctx);
            }

            @Command('cancel')
            async cancel(@Ctx() ctx: Context) {
            return this.usersService.cancel(ctx);
            }

                // Category ..
            @Command('addCategory')
            async addCategory(@Ctx() ctx: Context) {
            console.log('ADD CATEGORY COMMAND');
            return this.categoriesService.addCategory(ctx);
            }


            @Command("updateCategory")
                async updateCategory(@Ctx() ctx: Context) {

                    const telegramId = ctx.from!.id;

                    await this.conversationService.saveSession(
                        telegramId,
                        {
                            state: ConversationState.UPDATE_CATEGORY_WAITING_ID,
                        },
                    );

                    await ctx.reply(
                        CATEGORY_MESSAGES.ASK_UPDATE_ID,
                    );
                }

            @Command('deleteCategory')
            async deleteCategory(@Ctx() ctx: Context) {
            const telegramId = ctx.from!.id;

            await this.conversationService.saveSession(telegramId, {
                state: ConversationState.DELETE_CATEGORY_WAITING_ID,
            });

            await ctx.reply(CATEGORY_MESSAGES.ASK_DELETE_ID);
            }


            @Command("restoreCategory")
            async restoreCategory(
                @Ctx() ctx: Context,
            ) {

                const telegramId =
                    ctx.from!.id;

                await this.conversationService.saveSession(
                    telegramId,
                    {
                        state:
                            ConversationState.RESTORE_CATEGORY_WAITING_ID,
                    },
                );

                await ctx.reply(
                    CATEGORY_MESSAGES.ASK_CATEGORY_ID_TO_RESTORE,
                );

            }

            @Command("categoryTrash")
                async categoryTrash(
                    @Ctx() ctx: Context,
                ) {

                    return this.categoriesService.trash(ctx);

                }

                @Command("hardDeleteCategory")
                async hardDeleteCategory(
                    @Ctx() ctx: Context,
                ) {

                    const telegramId = ctx.from!.id;

                    await this.conversationService.saveSession(
                        telegramId,
                        {
                            state:
                ConversationState.HARD_DELETE_CATEGORY_WAITING_ID,
                },
            );

            await ctx.reply(
                CATEGORY_MESSAGES.ASK_HARD_DELETE_CATEGORY_ID,
            );

}

                // Expense 

                @Command('add')
                async add(@Ctx() ctx: Context){
                    console.log("ADD COMMAND");


                const telegramId = ctx.from!.id;


                await this.conversationService.saveSession(
                    telegramId,
                    {
                        state:
                        ConversationState.EXPENSE_WAITING_AMOUNT
                    }
                );


                await ctx.reply(
                    EXPENSE_MESSAGES.ASK_AMOUNT
                );

            }


            @Command('expenses')
                async expenses(
                    @Ctx() ctx: Context,
                ) {
                    return this.expensesService.expenses(ctx);
                }

                @Command('update')
                async update(@Ctx() ctx: Context) {
                    return this.expensesService.update(ctx);
                }

                @Command('delete')
                async delete(@Ctx() ctx: Context) {
                await this.expensesService.delete(ctx);
                }

                @Command('trash')
                    async trash(@Ctx() ctx: Context) {
                        return this.expensesService.trash(ctx);
                    }
                @Command('restore')
        async restore(@Ctx() ctx: Context) {

            const telegramId = ctx.from!.id;

            await this.conversationService.saveSession(
                telegramId,
                {
                    state:
                    ConversationState.RESTORE_EXPENSE_WAITING_ID,
                },
            );

            await ctx.reply(
                EXPENSE_MESSAGES.ASK_EXPENSE_ID_TO_RESTORE,
            );
        }


        @Command('hard')
            async hardDelete(@Ctx() ctx: Context) {

                const telegramId = ctx.from!.id;

                await this.conversationService.saveSession(
                    telegramId,
                    {
                        state:
                        ConversationState.HARD_DELETE_EXPENSE_WAITING_ID,
                    },
                );


                await ctx.reply(
                    EXPENSE_MESSAGES.ASK_HARD_DELETE_ID,
                );
            }

        

            @Command('categories')
            async categories(@Ctx() ctx: Context) {
            return this.categoriesService.categories(ctx);
}
            // Reports 
            @Command("report")
            async report(@Ctx() ctx: Context) {
                return this.reportsService.report(ctx);
            }
            @Command('stats')
                async stats(
                    @Ctx() ctx: Context
                ){

                    return this.reportsService.stats(ctx);

                }

            // Budget ..
            @Command("budget")
                async budget(
                    @Ctx() ctx: Context,
                ) {

                    if (
                        ctx.message &&
                        "text" in ctx.message &&
                        ctx.message.text.trim().includes(" ")
                    ) {

                        return this.usersService.setBudget(ctx);

                    }

                    return this.usersService.budget(ctx);

                }

                // Export ....
                @Command('export')
            async export(
            @Ctx() ctx: Context,
            ){

                const text =
                ctx.message &&
                        "text" in ctx.message
                        ? ctx.message.text
                        : "";
            const monthly =
            text.includes("monthly");


            return this.exportService.exportExpenses(
                ctx,
                monthly,
            );

        }

        @Command('exportPdf')
        async exportPdf(
            @Ctx() ctx: Context,
        ){

            return this.exportService.exportPdf(ctx);

        }

        //  Ai ............................

        @Command('scan')
        async scan(ctx: Context) {
            await this.conversationService.setState(
                ctx.from!.id,
                ConversationState.SCAN_RECEIPT_WAITING_IMAGE,
            );
            await ctx.reply(
                "📷 Please send your receipt photo.",

            );

        }

           @Action('receipt_save')
        async saveReceipt(
            @Ctx() ctx: Context
        ){

            console.log("🔥 SAVE BUTTON CLICKED");


            await ctx.answerCbQuery();


            const telegramId = ctx.from!.id;


            const receipt =
            await this.redisService.get(
                RedisKeys.expenseDraft(telegramId)
            );


            console.log("RECEIPT FROM REDIS:", receipt);



            if(!receipt){

                return ctx.editMessageText(
                    "❌ Receipt expired"
                );

            }


            const user =
            await this.usersRepository.findByTelegramId(
                telegramId
            );


            if(!user){

                return ctx.editMessageText(
                    "❌ User not found"
                );

            }


            await this.expensesService.createFromReceipt(
                user._id,
                receipt
            );


                    await this.redisService.deleteKeys(
                        RedisKeys.expenseDraft(telegramId)
                    );


                    await ctx.editMessageText(
                `
                ✅ Expense Saved Successfully

                🏪 ${receipt.merchant}

                💰 ${receipt.amount} ${receipt.currency}

                📂 ${receipt.category}
                `
                );

                }



                @Action('receipt_cancel')
                async cancelReceipt(
                    @Ctx() ctx: Context
                ){

                    await ctx.answerCbQuery();


                    const telegramId = ctx.from!.id;


                    await this.redisService.deleteKeys(
                        RedisKeys.expenseDraft(telegramId)
                    );


                    await ctx.editMessageText(
                        "❌ Receipt Cancelled"
                    );

        }


        @Command("insights")
            async insights(
                @Ctx() ctx: Context,
            ){
                return this.reportsService.insights(ctx);
            }

            @Command("forecast")
            async forecast(@Ctx() ctx: Context) {
                return this.reportsService.forecast(ctx);
                        }
            
            @On('voice')
            async handleVoice(
                @Ctx() ctx: Context,
            ) {

                console.log("🎤 VOICE RECEIVED");

                await this.voiceExpenseHandler.handle(ctx);

}
            






            @Hears("💰 Add Expense")
                async addExpenseButton(
                    @Ctx() ctx: Context
                ){
                    return this.add(ctx);
                }


                @Hears("📷 Scan Receipt")
                async scanReceiptButton(
                    @Ctx() ctx: Context
                ){
                    return this.scan(ctx);
                }


                @Hears("📊 Report")
                async reportButton(
                    @Ctx() ctx: Context
                ){
                    return this.report(ctx);
                }


                @Hears("📈 Statistics")
                async statsButton(
                    @Ctx() ctx: Context
                ){
                    return this.stats(ctx);
                }


                @Hears("🤖 AI Insights")
                async insightsButton(
                    @Ctx() ctx: Context
                ){
                    return this.reportsService.insights(ctx);
                }


                @Hears("🔮 Forecast")
                async forecastButton(
                    @Ctx() ctx: Context
                ){
                    return this.reportsService.forecast(ctx);
                }


                @Hears("📂 Categories")
                async categoriesButton(
                    @Ctx() ctx: Context
                ){
                    return this.categories(ctx);
                }


                @Hears("👤 Profile")
                async profileButton(
                    @Ctx() ctx: Context
                ){
                    return this.profile(ctx);
                }


                @Hears("❓ Help")
                async helpButton(
                    @Ctx() ctx: Context
                ){
                    return this.help(ctx);
                }


                @Hears("❌ Cancel")
                async cancelButton(
                    @Ctx() ctx: Context
                ){
                    return this.cancel(ctx);
                }
                    @On('text')
                    async onText(@Ctx() ctx: Context) {

                    if (!ctx.message || !('text' in ctx.message)) {
                        return;
                    }
                    // Ignore Telegram commands
                if (
                        ctx.message.text.startsWith('/') ||
                        [
                            "💰 Add Expense",
                            "📷 Scan Receipt",
                            "📊 Report",
                            "📈 Statistics",
                            "🤖 AI Insights",
                            "🔮 Forecast",
                            "📂 Categories",
                            "👤 Profile",
                            "❓ Help",
                            "❌ Cancel",
                        ].includes(ctx.message.text)
                    ) {
                        return;
                    }


                    console.log('TEXT EVENT:', ctx.message);


                    return this.conversationRouter.handle(ctx);
                }
                @On("photo")
                    async onPhoto(@Ctx() ctx: Context) {

                        console.log("PHOTO EVENT");

                        return this.conversationRouter.handle(ctx);

                    }
                            
                        


        }
