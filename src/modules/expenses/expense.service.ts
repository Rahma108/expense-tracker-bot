import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ExpenseRepository } from '../../common/repository/expense.repository';
import { Context } from 'telegraf';
import { EXPENSE_MESSAGES, UserMessages } from '../../common/messages';
import { UserRepository } from '../../common/repository';
import { ConversationState } from '../../common/enums';
import { ConversationService } from '../conversation/conversation.service';


@Injectable()
export class ExpensesService {


constructor(
        private readonly expenseRepository: ExpenseRepository,
        private readonly userRepository: UserRepository,
        private readonly conversationService:ConversationService
){}



        async createExpense(data:{
            userId: Types.ObjectId;
            amount:number;
            category:string;
            note?: string | null;
            currency?:string;
        }){


        return this.expenseRepository.createOne({

            data:{
                    userId: data.userId,
                    amount: data.amount,
                    category: data.category,
                    note: data.note ?? null,
                currency:data.currency ?? 'EGP',
                date:new Date(),
            }

        });


        }

        async getUserExpenses(
            telegramId: number,
            page = 1,
        ) {
            const user = await this.userRepository.findByTelegramId(
                telegramId,
            );

            if (!user) {
                return null;
            }

            return this.expenseRepository.findUserExpenses(
                user._id,
                page,
            );
}


        async expenses(ctx: Context) {

            const telegramId = ctx.from!.id;

            const result =
                await this.getUserExpenses(telegramId);

            if (!result || result.docs.length === 0) {
                await ctx.reply(
                    EXPENSE_MESSAGES.EXPENSES_EMPTY,
                );
                return;
            }

            const text = result.docs
                .map((expense, index) => {

                    return `${index + 1}. 💰 ${expense.amount} ${expense.currency}
                            📂 ${expense.category}
                            📝 ${expense.note ?? '-'}
                            🆔 ${expense._id}`;

                })
                .join('\n\n');

            await ctx.reply(
                EXPENSE_MESSAGES.EXPENSE_LIST(
                    text,
                    result.currentPage,
                    result.pages,
                    result.totalDocs,
                ),
            );
        }

        async update(ctx: Context) {

            const telegramId = ctx.from!.id;

            await this.conversationService.saveSession(
                telegramId,
                {
                    state: ConversationState.UPDATE_EXPENSE_WAITING_ID,
                },
            );

            await ctx.reply(
                EXPENSE_MESSAGES.ASK_EXPENSE_ID,
            );
        }

        async delete(ctx: Context) {
            const telegramId = ctx.from!.id;

            await this.conversationService.saveSession(
                telegramId,
                {
                state: ConversationState.DELETE_EXPENSE_WAITING_ID,
                },
            );

            await ctx.reply(
                EXPENSE_MESSAGES.ASK_EXPENSE_ID_,
            );
            }
        async trash(ctx: Context) {

    const telegramId = ctx.from!.id;

    const user =
        await this.userRepository.findByTelegramId(
            telegramId,
        );

    if (!user) {
        await ctx.reply(UserMessages.USER_NOT_FOUND);
        return;
    }

    const expenses =
        await this.expenseRepository.findDeletedExpenses(
            user._id,
        );

    if (!expenses.length) {
        await ctx.reply(
            EXPENSE_MESSAGES.NO_DELETED_EXPENSES,
        );
        return;
    }

    let msg = '🗑 Deleted Expenses\n\n';

    expenses.forEach((expense, index) => {
        msg += `${index + 1}. 💰 ${expense.amount} ${expense.currency}\n`;
        msg += `📂 ${expense.category}\n`;
        msg += `📝 ${expense.note ?? '-'}\n`;
        msg += `🆔 ${expense._id}\n\n`;
    });

    await ctx.reply(msg);
}

}