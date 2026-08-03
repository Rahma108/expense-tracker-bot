import { Inject, Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { ConversationService } from './conversation.service';
import { ConversationState } from '../../common/enums';
import { IConversationHandler } from '../../common/interfaces';
import { CONVERSATION_HANDLERS } from '../../common/constants';


@Injectable()
export class ConversationRouterService {

    private handlers =
    new Map<ConversationState, IConversationHandler>();


    constructor(
        @Inject(CONVERSATION_HANDLERS)
        private readonly handlersList: IConversationHandler[],

        private readonly conversationService: ConversationService,
    ){

        handlersList.forEach((handler)=>{

            this.handlers.set(
                handler.state,
                handler,
            );

        });

    }


    async handle(ctx: Context) {
    const telegramId = ctx.from!.id;

    const state = await this.conversationService.getState(
        telegramId,
    );

    console.log('Current State:', state);

    const handler = this.handlers.get(state);

    console.log('Handler:', handler?.constructor?.name);

    if (!handler) {
        console.log('No handler found');
        return;
    }

    return handler.handle(ctx);
}


}

