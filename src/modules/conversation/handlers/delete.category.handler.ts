import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";

import { ConversationService } from "../conversation.service";
import { CategoriesService } from "../../categories/categories.service";
import { ExpensesService } from "../../expenses/expense.service";
import { UserRepository } from "../../../common/repository";

import {
    CATEGORY_MESSAGES,
} from "../../../common/messages";

import {
    ConversationState,
} from "../../../common/enums";

import {
    IConversationHandler,
} from "../../../common/interfaces";

@Injectable()
export class DeleteCategoryHandler
implements IConversationHandler {

    readonly state =
        ConversationState.DELETE_CATEGORY_WAITING_ID;

    constructor(
        private readonly conversationService: ConversationService,
        private readonly usersRepository: UserRepository,
        private readonly categoriesService: CategoriesService,
        private readonly expensesService: ExpensesService,
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

        const expense =
            await this.expensesService.categoryHasExpenses(
                user._id,
                category.name,
            );

        if (expense) {

            await ctx.reply(
                CATEGORY_MESSAGES.USED_IN_EXPENSE,
            );

            return;
        }

        await this.categoriesService.delete(
            category._id.toString(),
            user._id,
        );

        await this.conversationService.clearSession(
            telegramId,
        );

        await ctx.reply(
            CATEGORY_MESSAGES.DELETED,
        );
    }
}