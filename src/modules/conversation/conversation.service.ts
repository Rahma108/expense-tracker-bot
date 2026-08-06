import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { IConversationSession } from '../../common/interfaces/conversation-session.interface';
import { ConversationState } from '../../common/enums';
@Injectable()
export class ConversationService {
  constructor(
    private readonly redisService: RedisService,
    
    ) {}



    async getSession(
        telegramId: number,
    ): Promise<IConversationSession | null> {
        return await this.redisService.get(
        this.redisService.userSessionKey(telegramId),
        );
    }

    async saveSession(
    telegramId:number,
    session:IConversationSession,
){

    await this.redisService.set({

        key:this.redisService.userSessionKey(telegramId),

        value:session,

        ttl:60 * 10, // 10 minutes

    });

}


            async startConversation(
                telegramId: number,
                state: ConversationState,
            ) {

                await this.saveSession(
                    telegramId,
                    {
                        state,
                        expenseDraft: {},
                    },
                );

            }

    async clearSession(
        telegramId: number,
    ) {
        await this.redisService.deleteKeys(
        this.redisService.userSessionKey(telegramId),
        );
    }

    async setState(
        telegramId: number,
        state: ConversationState,
    ) {
        const session =
        (await this.getSession(telegramId)) ?? {
            state: ConversationState.NONE,
        };

        session.state = state;

        await this.saveSession(
        telegramId,
        session,
        );
    }

    async getState(
        telegramId: number,
    ): Promise<ConversationState> {
        const session = await this.getSession(
        telegramId,
        );

        return session?.state ?? ConversationState.NONE;
    }


        async hasActiveSession(
            telegramId:number
        ){

            const session =
            await this.getSession(telegramId);


            return !!(
                session &&
                session.state !== ConversationState.NONE
            );

        }




        
}