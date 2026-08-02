import { ConversationState } from "../enums/conversation-state.enum";

export interface IConversationSession {

    state: ConversationState;

    data: Record<string, any>;

}