import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";

import { ConversationService } from "../conversation.service";
import { CategoriesService } from "../../categories/categories.service";
import { UserRepository } from "../../../common/repository";
import { CATEGORY_MESSAGES } from "../../../common/messages";
import { ConversationState } from "../../../common/enums";
import { IConversationHandler } from "../../../common/interfaces";

@Injectable()
export class UpdateCategoryNameHandler
implements IConversationHandler {

    readonly state =
        ConversationState.UPDATE_CATEGORY_WAITING_NAME;

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
                CATEGORY_MESSAGES.INVALID_NAME,
            );
            return;
        }

        const newName =
            ctx.message.text.trim();

        const session =
            await this.conversationService.getSession(
                telegramId,
            );

        const user =
            await this.usersRepository.findByTelegramId(
                telegramId,
            );

        if (!session || !user) {
            return;
        }

        const exists =
            await this.categoriesService.findByName(
                user._id,
                newName,
            );

        if (exists) {

            await ctx.reply(
                CATEGORY_MESSAGES.EXISTS,
            );

            return;
        }

        await this.categoriesService.updateName(
            session.categoryId!,
            user._id,
            newName,
        );

        await this.conversationService.clearSession(
            telegramId,
        );

        await ctx.reply(
            CATEGORY_MESSAGES.UPDATED,
        );
    }
}