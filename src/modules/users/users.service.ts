import { Injectable } from '@nestjs/common';
import { Context } from 'node_modules/telegraf/typings/context';
import { UserMessages } from 'src/common/messages/index';
import { UserRepository } from 'src/common/repository/user.repository';

@Injectable()
export class UsersService {
    constructor(
    private readonly usersRepository:UserRepository 
){}
    async start(ctx: Context) {
        const telegramId = ctx.from!.id;

        const user = await this.usersRepository.findByTelegramId(
            telegramId,
        );

        if (user) {
            await ctx.reply ( UserMessages.WELCOME_BACK(user.firstName) ,  );
            return;
        }
        await ctx.reply(
        UserMessages.WELCOME
        );
        }


}
