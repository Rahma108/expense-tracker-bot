import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationState } from '../../../common/enums';
import { ConversationService } from '../conversation.service';
import { IConversationHandler } from '../../../common/interfaces';
import { EXPENSE_MESSAGES } from '../../../common/messages';


@Injectable()
export class ExpenseAmountHandler
implements IConversationHandler {


        state =
        ConversationState.EXPENSE_WAITING_AMOUNT;



            constructor(
            private readonly conversationService: ConversationService,
            ){}



            async handle(ctx: Context){


            const telegramId =
            ctx.from!.id;



            if(!ctx.message || !('text' in ctx.message))
            return;



            const amount =
            Number(ctx.message.text);



            if(isNaN(amount) || amount <=0){

            await ctx.reply(
            EXPENSE_MESSAGES.INVALID_AMOUNT
            );

            return;

            }



            const session =
            await this.conversationService.getSession(
            telegramId
            );



            if(!session)
            return;



            session.expenseDraft = {

            ...session.expenseDraft,

            amount

            };



            session.state =
            ConversationState.EXPENSE_WAITING_CATEGORY;



            await this.conversationService.saveSession(
            telegramId,
            session
            );



            await ctx.reply(
            EXPENSE_MESSAGES.ASK_CATEGORY
            );



            }

}