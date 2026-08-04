import { Context } from "telegraf";
import { CATEGORY_MESSAGES } from "../../../common/messages";
import { CategoriesService } from "../../categories/categories.service";
import { UserRepository } from "../../../common/repository";
import { ConversationService } from "../conversation.service";
import { ConversationState } from "../../../common/enums";
import { IConversationHandler } from "../../../common/interfaces";
import { Injectable } from "@nestjs/common";

@Injectable()
export class HardDeleteCategoryHandler
implements IConversationHandler {

    readonly state =
        ConversationState.HARD_DELETE_CATEGORY_WAITING_ID;

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
            return;
        }

        const id =
            ctx.message.text.trim();

        const user =
            await this.usersRepository.findByTelegramId(
                telegramId,
            );

        if (!user) {
            return;
        }

        const category =
            await this.categoriesService.findDeletedById(
                id,
                user._id,
            );

        if (!category) {

            await ctx.reply(
                CATEGORY_MESSAGES.CATEGORY_NOT_FOUND,
            );

            return;
        }

        if (category.isDefault) {

            await ctx.reply(
                "❌ Default categories cannot be deleted.",
            );

            return;
        }

        await this.categoriesService.hardDelete(
            id,
            user._id,
        );

        await this.conversationService.clearSession(
            telegramId,
        );

        await ctx.reply(
            CATEGORY_MESSAGES.CATEGORY_HARD_DELETED,
        );

    }

}