import { Injectable } from "@nestjs/common";
import { EXPENSE_MESSAGES } from "../../../common/messages";
import { IConversationHandler } from "../../../common/interfaces";
import { ConversationState } from "../../../common/enums";
import { ConversationService } from "../conversation.service";
import { ExpenseRepository } from "../../../common/repository/expense.repository";
import { Context } from "telegraf";

@Injectable()
export class DeleteExpenseIdHandler
  implements IConversationHandler {

  readonly state =
    ConversationState.DELETE_EXPENSE_WAITING_ID;

  constructor(
    private readonly conversationService: ConversationService,
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async handle(ctx: Context) {

    if (!ctx.message || !('text' in ctx.message))
      return;

    const id = ctx.message.text.trim();

    await this.expenseRepository.findOneAndUpdate({
      filter: {
        _id: id,
      },
      update: {
        deletedAt: new Date(),
      },
    });

    await this.conversationService.clearSession(
      ctx.from!.id,
    );

    await ctx.reply(
      EXPENSE_MESSAGES.DELETE_SUCCESS,
    );
  }
}