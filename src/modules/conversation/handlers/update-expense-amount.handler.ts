import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationService } from '../conversation.service';
import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { EXPENSE_MESSAGES } from '../../../common/messages';

@Injectable()
export class UpdateExpenseAmountHandler
implements IConversationHandler {

    readonly state =
        ConversationState.UPDATE_EXPENSE_WAITING_AMOUNT;

    constructor(
        private readonly conversationService: ConversationService,
    ) {}

    async handle(ctx: Context) {

        const telegramId = ctx.from!.id;

        if (!ctx.message || !('text' in ctx.message)) {
            await ctx.reply(
                EXPENSE_MESSAGES.INVALID_AMOUNT,
            );
            return;
        }

        const amount =
        Number(ctx.message.text.trim());

        if (isNaN(amount) || amount <= 0) {
            await ctx.reply(
                EXPENSE_MESSAGES.INVALID_AMOUNT,
            );
            return;
        }

        const session =
        await this.conversationService.getSession(
            telegramId,
        );

        if (!session) {
            await ctx.reply(
                EXPENSE_MESSAGES.SESSION_EXPIRED,
            );
            return;
        }

        session.expenseDraft ??= {};

        session.expenseDraft.amount = amount;

        session.state =
        ConversationState.UPDATE_EXPENSE_WAITING_CATEGORY;

        await this.conversationService.saveSession(
            telegramId,
            session,
        );

        await ctx.reply(
            EXPENSE_MESSAGES.ASK_NEW_CATEGORY,
        );
    }
}