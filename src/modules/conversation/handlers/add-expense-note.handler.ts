import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { ConversationService } from '../conversation.service';

import { UserRepository } from '../../../common/repository/user.repository';
import { ExpensesService } from '../../expenses/expense.service';
import { EXPENSE_MESSAGES, UserMessages } from '../../../common/messages';
import { AiService } from '../../ai/ai.service';


@Injectable()
export class ExpenseNoteHandler 
implements IConversationHandler {


state = ConversationState.EXPENSE_WAITING_NOTE;



constructor(
    private readonly conversationService: ConversationService,

    private readonly expensesService: ExpensesService,

    private readonly userRepository: UserRepository,
    private readonly aiService: AiService,
){}



async handle(ctx: Context){

    const telegramId = ctx.from!.id;



    if(!ctx.message || !('text' in ctx.message)){

        await ctx.reply(
            EXPENSE_MESSAGES.INVALID_TEXT
        );

        return;
    }



            const note =ctx.message.text.trim();
            const finalNote = note.toLowerCase() === "skip" ? undefined : note;
            const session = await this.conversationService.getSession(
                        telegramId,
                    );

                    if (!session || !session.expenseDraft) {
                        await ctx.reply(
                            EXPENSE_MESSAGES.SESSION_EXPIRED,
                        );
                        return;
                    }

                    let category = session.expenseDraft.category!;

                    if (finalNote &&category.toLowerCase() === "other"
                    ) {
                        category = await this.aiService.suggestCategory(finalNote);
                    }

                    const user =
                    await this.userRepository.findByTelegramId(
                        telegramId
                    );

                    if(!user){

                        await ctx.reply(
                            UserMessages.PROFILE_NOT_FOUND
                        );

                        return;
                    }

            await this.expensesService.createExpense({

                userId: user._id,

                amount:
                session.expenseDraft.amount!,

                category,
                note: finalNote,
                currency:
                user.currency ?? 'EGP',

            });


            let message = EXPENSE_MESSAGES.CREATED;
            const monthlyBudget = user.monthlyBudget ?? 0;

            if (monthlyBudget > 0) {

                const spent =
                    await this.expensesService.getCurrentMonthTotal(
                        user._id,
                    );

                const percent = Math.round(
                    (spent / monthlyBudget) * 100,
                );

                const remaining =
                    monthlyBudget - spent;

                const progress =
                    this.expensesService.buildProgressBar(
                        percent,
                    );

                message += `

            💰 Budget Summary

            💸 Spent: ${spent} ${user.currency}
            🎯 Budget: ${monthlyBudget} ${user.currency}
            💵 Remaining: ${remaining} ${user.currency}

            ${progress} ${percent}%`;

                if (percent >= 100) {

                    message += `

            🚨 Over Budget: ${
                        spent - monthlyBudget
                    } ${user.currency}`;

                } else if (percent >= 90) {

                    message += `

            ⚠️ You have used over 90% of your monthly budget.`;

                } else if (percent >= 80) {

                    message += `

            ⚠️ You have used over 80% of your monthly budget.`;

                }
            }

        await this.conversationService.clearSession(
            telegramId,
        );

        await ctx.reply(message);

}

}