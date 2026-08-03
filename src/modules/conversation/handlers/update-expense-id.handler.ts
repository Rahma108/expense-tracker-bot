import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationService } from '../conversation.service';
import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { EXPENSE_MESSAGES } from '../../../common/messages';
import { ExpenseRepository } from '../../../common/repository/expense.repository';

@Injectable()
export class UpdateExpenseIdHandler implements IConversationHandler {
  readonly state = ConversationState.UPDATE_EXPENSE_WAITING_ID;

  constructor(
    private readonly conversationService: ConversationService,
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async handle(ctx: Context) {
    const telegramId = ctx.from!.id;

    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply(EXPENSE_MESSAGES.INVALID_EXPENSE_ID);
      return;
    }

    const expenseId = ctx.message.text.trim();

    const expense = await this.expenseRepository.findOne({
      filter: {
        _id: expenseId,
      },
    });

    if (!expense) {
      await ctx.reply(EXPENSE_MESSAGES.EXPENSES_EMPTY);
      return;
    }

    const session =
      await this.conversationService.getSession(telegramId);

    if (!session) {
      await ctx.reply(EXPENSE_MESSAGES.SESSION_EXPIRED);
      return;
    }

    session.expenseId = expenseId;

    session.expenseDraft = {
      amount: expense.amount,
      category: expense.category,
      note: expense.note ?? undefined,
    };

    session.state =
      ConversationState.UPDATE_EXPENSE_WAITING_AMOUNT;

    await this.conversationService.saveSession(
      telegramId,
      session,
    );

    await ctx.reply(EXPENSE_MESSAGES.ASK_NEW_AMOUNT);
  }
}