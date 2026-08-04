import { Start, Update, Ctx,  On, Command } from 'nestjs-telegraf';
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

// Events in telegram ............

@Update()
@Injectable()
export class TelegramUpdate {
        constructor(
            private readonly usersService: UsersService,
            private readonly conversationRouter: ConversationRouterService,
            private readonly conversationService : ConversationService,
            private readonly expensesService : ExpensesService ,
            private readonly categoriesService : CategoriesService,
            private readonly reportsService: ReportsService,
            private readonly exportService: ExportService,

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


            @On('text')
            async onText(@Ctx() ctx: Context) {

            if (!ctx.message || !('text' in ctx.message)) {
                return;
            }
            // Ignore Telegram commands
            if (ctx.message.text.startsWith('/')) {
                return;
            }


            console.log('TEXT EVENT:', ctx.message);


            return this.conversationRouter.handle(ctx);
        }

                    
                


}
