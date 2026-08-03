import { Injectable } from "@nestjs/common";
import { ConversationState } from "../../../common/enums";
import { IConversationHandler } from "../../../common/interfaces";
import { ConversationService } from "../conversation.service";
import { UserRepository } from "../../../common/repository";
import { CategoriesService } from "../../categories/categories.service";
import { Context } from "telegraf";
import { CATEGORY_MESSAGES } from "../../../common/messages";

@Injectable()
export class AddCategoryHandler
implements IConversationHandler {

readonly state =
        ConversationState.ADD_CATEGORY_WAITING_NAME;

        constructor(

        private readonly conversationService:ConversationService,

        private readonly usersRepository:UserRepository,

        private readonly categoriesService:CategoriesService,

        ){}

        async handle(ctx: Context){

        const telegramId = ctx.from!.id;

        if(
        !ctx.message ||
        !("text" in ctx.message)
        ){
        await ctx.reply(
        CATEGORY_MESSAGES.INVALID_NAME,
        );
        return;
        }


        const user =
            await this.usersRepository.findByTelegramId(
                telegramId,
            );

            if (!user) {
                await ctx.reply("❌ User not found.");
                return;
            }

        const name =
        ctx.message.text.trim();

        const exists =
        await this.categoriesService.findByName(
        user._id,
        name,
        );

        if(exists){

        await ctx.reply(
        CATEGORY_MESSAGES.EXISTS,
        );

        return;

        }

        await this.categoriesService.create(
        user!._id,
        name,
        );

        await this.conversationService.clearSession(
        telegramId,
        );

        await ctx.reply(
        CATEGORY_MESSAGES.CREATED,
        );

        }

}