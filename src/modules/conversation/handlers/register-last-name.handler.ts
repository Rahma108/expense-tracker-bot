import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { ConversationService } from '../conversation.service';
import { UserRepository } from '../../../common/repository/user.repository';
import { UserMessages } from '../../../common/messages';
import { CategoriesService } from '../../categories/categories.service';


@Injectable()
export class RegisterLastNameHandler
implements IConversationHandler {


state =
ConversationState.REGISTER_WAITING_LAST_NAME;



constructor(
     private readonly conversationService: ConversationService,
    private readonly userRepository: UserRepository,
    private readonly categoriesService: CategoriesService,
){}



async handle(ctx: Context){


const telegramId =
ctx.from!.id;



if(!ctx.message || !('text' in ctx.message)){


    await ctx.reply(
        UserMessages.INVALID_TEXT
    );

    return;

}



const lastName =
ctx.message.text.trim();



const session =
await this.conversationService.getSession(
    telegramId
);



if(!session || !session.firstName){


    await ctx.reply(
        UserMessages.SESSION_EXPIRED
    );


    return;

}




const user =
await this.userRepository.createOne({

    data:{

        telegramId,

        firstName: session.firstName,

        lastName,

        username: ctx.from?.username,

        currency:'EGP'

    }

});

await this.categoriesService.createDefaultCategories(
    user._id,
);


await this.conversationService.clearSession(
    telegramId
);



await ctx.reply(
    UserMessages.REGISTER_SUCCESS(
        `${session.firstName} ${lastName}`
    )
);


}

}