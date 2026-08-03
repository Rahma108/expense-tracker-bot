import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { GeneralMessages, UserMessages } from '../../common/messages';
import { UserRepository } from '../../common/repository/user.repository';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationState } from '../../common/enums';


@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepository: UserRepository,

        @Inject(forwardRef(() => ConversationService))
        private readonly conversationService: ConversationService,
    ) {}


    async start(ctx: Context) {

        const telegramId = ctx.from!.id;


        const user =
        await this.usersRepository.findByTelegramId(
            telegramId,
        );


        if(user){

            await ctx.reply(
                UserMessages.WELCOME_BACK(
                    user.firstName
                )
            );

            return;
        }


        await ctx.reply(
            UserMessages.WELCOME
        );

    }



    async register(ctx: Context) {


        const telegramId =
        ctx.from!.id;



        const user =
        await this.usersRepository.findByTelegramId(
            telegramId
        );


        if(user){

            await ctx.reply(
                UserMessages.ALREADY_REGISTERED
            );

            return;
        }



        const session =
        await this.conversationService.getSession(
            telegramId
        );



        if(
            session &&
            session.state !== ConversationState.NONE
        ){

            await ctx.reply(
                UserMessages.REGISTRATION_IN_PROGRESS
            );

            return;
        }



        await this.conversationService.saveSession(
            telegramId,
            {
                state:
                ConversationState.REGISTER_WAITING_FIRST_NAME
            }
        );



        await ctx.reply(
            UserMessages.REGISTER_START
        );

    }



    async profile(ctx: Context) {


        const telegramId =
        ctx.from!.id;



        const user =
        await this.usersRepository.findByTelegramId(
            telegramId
        );


        if(!user){

            await ctx.reply(
                UserMessages.PROFILE_NOT_FOUND
            );

            return;
        }



        await ctx.reply(
            UserMessages.PROFILE(
                user.firstName,
                user.lastName,
                user.username,
                user.currency,
            ),
            {
                parse_mode:'HTML'
                }
        );

    }



    async help(ctx: Context){

        await ctx.reply(
            UserMessages.HELP
        );

    }




    async cancel(ctx: Context){

    const telegramId = ctx.from!.id;


    const active =
    await this.conversationService.hasActiveSession(
        telegramId
    );


    if(!active){

        await ctx.reply(
            GeneralMessages.NOTHING_TO_CANCEL
        );

        return;
    }


    await this.conversationService.clearSession(
        telegramId
    );


    await ctx.reply(
        GeneralMessages.CANCEL_SUCCESS
    );

}

}