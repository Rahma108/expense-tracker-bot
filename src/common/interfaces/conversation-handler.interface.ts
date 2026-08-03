import { Context } from 'telegraf';
import { ConversationState } from '../enums/conversation-state.enum';

export interface IConversationHandler {

    state: ConversationState;

    handle(
        ctx: Context,
    ): Promise<void>;

}