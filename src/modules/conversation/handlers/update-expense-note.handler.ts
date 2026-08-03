import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationService } from '../conversation.service';
import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { EXPENSE_MESSAGES } from '../../../common/messages';
import { ExpenseRepository } from '../../../common/repository/expense.repository';

@Injectable()
export class UpdateExpenseNoteHandler
    implements IConversationHandler {

    readonly state =
        ConversationState.UPDATE_EXPENSE_WAITING_NOTE;

    constructor(
        private readonly conversationService: ConversationService,
        private readonly expenseRepository: ExpenseRepository,
    ) {}

    async handle(ctx: Context) {

        const telegramId = ctx.from!.id;

        if (!ctx.message || !('text' in ctx.message)) {
            await ctx.reply(
                EXPENSE_MESSAGES.INVALID_NOTE,
            );
            return;
        }

        const session =
            await this.conversationService.getSession(
                telegramId,
            );

        if (
            !session ||
            !session.expenseId ||
            !session.expenseDraft
        ) {
            await ctx.reply(
                EXPENSE_MESSAGES.SESSION_EXPIRED,
            );
            return;
        }

        const note = ctx.message.text.trim();

        session.expenseDraft.note =
            note.toLowerCase() === 'skip'
                ? undefined
                : note;

        await this.expenseRepository.findOneAndUpdate({
            filter: {
                _id: session.expenseId,
            },
            update: {
                amount: session.expenseDraft.amount,
                category: session.expenseDraft.category,
                note: session.expenseDraft.note,
            },
        });

        await this.conversationService.clearSession(
            telegramId,
        );

        await ctx.reply(
            EXPENSE_MESSAGES.UPDATE_SUCCESS,
        );
    }
}