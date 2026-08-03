import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationService } from '../conversation.service';
import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { EXPENSE_MESSAGES } from '../../../common/messages';

@Injectable()
export class UpdateExpenseCategoryHandler
implements IConversationHandler {

    readonly state =
        ConversationState.UPDATE_EXPENSE_WAITING_CATEGORY;

    constructor(
        private readonly conversationService: ConversationService,
    ) {}

    async handle(ctx: Context) {

        const telegramId = ctx.from!.id;

        if (!ctx.message || !('text' in ctx.message)) {
            await ctx.reply(
                EXPENSE_MESSAGES.INVALID_CATEGORY,
            );
            return;
        }

        const category =
            ctx.message.text.trim();

        if (!category) {
            await ctx.reply(
                EXPENSE_MESSAGES.INVALID_CATEGORY,
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

        session.expenseDraft.category = category;

        session.state =
            ConversationState.UPDATE_EXPENSE_WAITING_NOTE;

        await this.conversationService.saveSession(
            telegramId,
            session,
        );

        await ctx.reply(
            EXPENSE_MESSAGES.ASK_NEW_NOTE,
        );
    }
}