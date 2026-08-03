import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { ConversationService } from '../conversation.service';
import { UserMessages } from '../../../common/messages';


@Injectable()
export class RegisterFirstNameHandler 
implements IConversationHandler {


    state = ConversationState.REGISTER_WAITING_FIRST_NAME;


    constructor(
        private readonly conversationService: ConversationService,
    ){}



    async handle(ctx: Context) {

        const telegramId = ctx.from!.id;


        if(!ctx.message || !('text' in ctx.message)) {

            await ctx.reply(
                UserMessages.INVALID_TEXT
            );

            return;
        }


        const firstName =
        ctx.message.text.trim();



        const session =
        await this.conversationService.getSession(
            telegramId
        );



        if(!session){

            await ctx.reply(
                UserMessages.SESSION_EXPIRED
            );

            return;
        }



        session.firstName = firstName;


        session.state =
        ConversationState.REGISTER_WAITING_LAST_NAME;



        await this.conversationService.saveSession(
            telegramId,
            session
        );



        await ctx.reply(
            UserMessages.ASK_LAST_NAME
        );

    }

}