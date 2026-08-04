import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";

import { ConversationService } from "../conversation.service";
import { CategoriesService } from "../../categories/categories.service";
import { UserRepository } from "../../../common/repository";
import { CATEGORY_MESSAGES } from "../../../common/messages";
import { ConversationState } from "../../../common/enums";
import { IConversationHandler } from "../../../common/interfaces";

@Injectable()
export class UpdateCategoryIdHandler
implements IConversationHandler {

    readonly state =
        ConversationState.UPDATE_CATEGORY_WAITING_ID;

    constructor(
        private readonly conversationService: ConversationService,
        private readonly usersRepository: UserRepository,
        private readonly categoriesService: CategoriesService,
    ) {}

    async handle(ctx: Context) {

        const telegramId = ctx.from!.id;

        if (
            !ctx.message ||
            !("text" in ctx.message)
        ) {
            await ctx.reply(
                CATEGORY_MESSAGES.NOT_FOUND,
            );
            return;
        }

        const id =
            ctx.message.text.trim();

        const user =
            await this.usersRepository.findByTelegramId(
                telegramId,
            );

        if (!user) {
            await ctx.reply(
                "❌ User not found.",
            );
            return;
        }

        const category =
            await this.categoriesService.findById(
                id,
                user._id,
            );

        if (!category) {

            await ctx.reply(
                CATEGORY_MESSAGES.NOT_FOUND,
            );

            return;
        }

        const session =
            await this.conversationService.getSession(
                telegramId,
            );

        session!.categoryId =
            category._id.toString();

        session!.state =
            ConversationState.UPDATE_CATEGORY_WAITING_NAME;

        await this.conversationService.saveSession(
            telegramId,
            session!,
        );

        await ctx.reply(
            CATEGORY_MESSAGES.ASK_NEW_NAME,
        );
    }
}