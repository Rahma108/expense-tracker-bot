import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { ConversationService } from '../conversation.service';
import { EXPENSE_MESSAGES } from '../../../common/messages';
import { UserRepository } from '../../../common/repository';
import { CategoriesService } from '../../categories/categories.service';


@Injectable()
export class ExpenseCategoryHandler 
implements IConversationHandler {


    state = ConversationState.EXPENSE_WAITING_CATEGORY;


    constructor(
        private readonly conversationService: ConversationService,
        private readonly usersRepository: UserRepository,
        private readonly categoriesService: CategoriesService,
    ){}


async handle(ctx: Context) {

    const telegramId = ctx.from!.id;

    if (!ctx.message || !('text' in ctx.message)) {
        await ctx.reply(
            EXPENSE_MESSAGES.INVALID_TEXT,
        );
        return;
    }

    const category = ctx.message.text.trim();

    if (!category) {
        await ctx.reply(
            EXPENSE_MESSAGES.EMPTY_CATEGORY,
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

    const user =
        await this.usersRepository.findByTelegramId(
            telegramId,
        );

    if (!user) {
        await ctx.reply("❌ User not found.");
        return;
    }

    const exists =
        await this.categoriesService.findByName(
            user._id,
            category,
        );

    if (!exists) {
        await ctx.reply(
            "❌ Category not found.\n\nUse /categories to view your categories or /addCategory to create one.",
        );
        return;
    }

    session.expenseDraft = {
        ...session.expenseDraft,
        category,
    };

    session.state =
        ConversationState.EXPENSE_WAITING_NOTE;

    await this.conversationService.saveSession(
        telegramId,
        session,
    );

    await ctx.reply(
        EXPENSE_MESSAGES.ASK_NOTE,
    );
}
}