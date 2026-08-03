import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { ConversationService } from '../conversation.service';

import { UserRepository } from '../../../common/repository/user.repository';
import { ExpensesService } from '../../expenses/expense.service';
import { EXPENSE_MESSAGES, UserMessages } from '../../../common/messages';


@Injectable()
export class ExpenseNoteHandler 
implements IConversationHandler {


state = ConversationState.EXPENSE_WAITING_NOTE;



constructor(
    private readonly conversationService: ConversationService,

    private readonly expensesService: ExpensesService,

    private readonly userRepository: UserRepository,
){}



async handle(ctx: Context){

    const telegramId = ctx.from!.id;



    if(!ctx.message || !('text' in ctx.message)){

        await ctx.reply(
            EXPENSE_MESSAGES.INVALID_TEXT
        );

        return;
    }



    const note =
    ctx.message.text.trim();



    const session =
    await this.conversationService.getSession(
        telegramId
    );



    if(!session || !session.expenseDraft){

        await ctx.reply(
            EXPENSE_MESSAGES.SESSION_EXPIRED
        );

        return;
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

        category:
        session.expenseDraft.category!,

        note:
        note === 'skip'
        ? undefined
        : note,

        currency:
        user.currency ?? 'EGP',

    });



    await this.conversationService.clearSession(
        telegramId
    );



    await ctx.reply(
        EXPENSE_MESSAGES.CREATED
    );

}

}