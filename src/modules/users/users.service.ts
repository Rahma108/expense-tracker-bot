import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { GeneralMessages, UserMessages } from '../../common/messages';
import { UserRepository } from '../../common/repository/user.repository';
import { ConversationService } from '../conversation/conversation.service';
import { ConversationState } from '../../common/enums';
import { MAIN_MENU_KEYBOARD } from '../../common/keyboards/main.keyboard';


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
            ),
            MAIN_MENU_KEYBOARD,
        );

        return;
    }


    await ctx.reply(
        UserMessages.WELCOME,
        MAIN_MENU_KEYBOARD,
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

// Budget 
        async budget(ctx: Context) {

            const telegramId = ctx.from!.id;

            const user =
                await this.usersRepository.findByTelegramId(
                    telegramId,
                );

            if (!user) {
                await ctx.reply("❌ User not found.");
                return;
            }

            if (!user.monthlyBudget) {
                await ctx.reply(
                    "💰 No monthly budget set.\n\nUse:\n/budget 5000",
                );
                return;
            }

            await ctx.reply(
                `💰 Monthly Budget: ${user.monthlyBudget} ${user.currency}`,
            );

        }

            async setBudget(ctx: Context) {

            const telegramId = ctx.from!.id;

            const user =
                await this.usersRepository.findByTelegramId(
                    telegramId,
                );

            if (!user) {
                await ctx.reply("❌ User not found.");
                return;
            }

            if (
                !ctx.message ||
                !("text" in ctx.message)
            ) {
                return;
            }

            const parts =
                ctx.message.text.split(" ");

            if (parts.length !== 2) {

                await ctx.reply(
                    "Usage:\n/budget 5000",
                );

                return;
            }

            const amount =
                Number(parts[1]);

            if (
                Number.isNaN(amount) ||
                amount <= 0
            ) {

                await ctx.reply(
                    "❌ Invalid amount.",
                );

                return;
            }

            await this.usersRepository.updateBudget(
                user._id,
                amount,
            );

            await ctx.reply(
                `✅ Monthly budget set to ${amount} ${user.currency}`,
            );

        }

}