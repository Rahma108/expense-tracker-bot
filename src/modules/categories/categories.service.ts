import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "../../common/repository/category.repository";
import { Types } from "mongoose";
import { Context } from "telegraf";
import { ConversationState } from "../../common/enums";
import { CATEGORY_MESSAGES } from "../../common/messages";
import { ConversationService } from "../conversation/conversation.service";
import { UserRepository } from "../../common/repository";

@Injectable()
export class CategoriesService {


constructor(
private readonly categoryRepository:CategoryRepository,
private readonly conversationService : ConversationService ,
private readonly userRepository: UserRepository
){}

        private readonly DEFAULT_CATEGORIES = [
                "Food",
                "Transport",
                "Shopping",
                "Bills",
                "Health",
                "Education",
                "Entertainment",
                "Other",

                ];
                async create(
                        userId: Types.ObjectId,
                        name: string,
                    ) {

                        console.log("========== CREATE CATEGORY ==========");
                        console.log(userId.toString());
                        console.log(name);

                        const category = await this.categoryRepository.create({
                            data: {
                                name: name.trim(),
                                userId,
                            },
                });

                console.log(category);

                return category;
            }

        async createDefaultCategories(
                userId: Types.ObjectId,
            ) {

                for (const name of this.DEFAULT_CATEGORIES) {

                    await this.categoryRepository.create({

                            data: {
                                name,
                                userId,
                                isDefault: true,
                            },

                        });


                }

            }


        async addCategory(ctx: Context) {

        const telegramId = ctx.from!.id;

        await this.conversationService.saveSession(
            telegramId,
            {
                state: ConversationState.ADD_CATEGORY_WAITING_NAME,
            },
        );

        await ctx.reply(
            CATEGORY_MESSAGES.ASK_NAME,
        );
    }




        async findByName(
                userId: Types.ObjectId,
                name: string,
            ) {
                return this.categoryRepository.findOne({
                    filter: {
                        userId,
                        name: {
                            $regex: `^${name.trim()}$`,
                            $options: 'i',
                        },
                    },
                });
}



        async findUserCategories(
        userId:Types.ObjectId,
        ){


        return this.categoryRepository.find({

        filter:{
        userId,
        },

        });


        }



        async delete(
        id:string,
        userId:Types.ObjectId,
        ){


        return this.categoryRepository.updateOne({
            filter: {
            _id: id,
            userId,
            },
            update: {
            deletedAt: new Date(),
            },
  });

        }

        async restore(
            id: string,
            userId: Types.ObjectId,
        ) {

            return this.categoryRepository.updateOne({

                filter: {
                    _id: id,
                    userId,
                    paranoid: false,
                    deletedAt: {
                        $ne: null,
                    },
                },

                update: {
                    restoredAt: new Date(),
                    deletedAt:null
                },

            });

}

        async findDeletedById(
            id: string,
            userId: Types.ObjectId,
        ) {

            return this.categoryRepository.findOne({

                filter: {
                    _id: id,
                    userId,
                    paranoid: false,
                    deletedAt: {
                        $ne: null,
                    },
                },

    });

}

        async getTrash(userId: Types.ObjectId) {

    return this.categoryRepository.find({

        filter: {
            userId,
            paranoid: false,
            deletedAt: {
                $ne: null,
            },
        },

    });

}

    async trash(ctx: Context) {

    const telegramId = ctx.from!.id;

    const user =
        await this.userRepository.findByTelegramId(
            telegramId,
        );

    if (!user) {

        await ctx.reply(
            "❌ User not found.",
        );

        return;
    }

            const categories =
                await this.getTrash(user._id);

            if (!categories.length) {

                await ctx.reply(
                    "🗑 Trash is empty.",
                );

                return;
            }

            let message =
                "🗑 Deleted Categories\n\n";

            categories.forEach((category, index) => {

                message +=
        `${index + 1}. ${category.name}
        ID: ${category._id}

        `;

            });

            await ctx.reply(message);

        }


        async findById(
                id: string,
                userId: Types.ObjectId,
            ) {
                return this.categoryRepository.findOne({
                    filter: {
                        _id: id,
                        userId,
                    },
                });
            }

        async updateName(
                id: string,
                userId: Types.ObjectId,
                name: string,
            ) {
                return this.categoryRepository.updateOne({
                    filter: {
                        _id: id,
                        userId,
                    },
                    update: {
                        name: name.trim(),
                    },
                });
            }


        async getAll(userId: Types.ObjectId) {
                    return this.categoryRepository.find({
                        filter: {
                            userId,
                        },
                    });
                }

                async categories(ctx: Context) {

            const telegramId = ctx.from!.id;

            const user =
                await this.userRepository.findByTelegramId(
                    telegramId,
                );

            if (!user) {
                await ctx.reply("❌ User not found.");
                return;
            }

            const categories =
                await this.getAll(user._id);

            if (!categories.length) {
                await ctx.reply("📂 No categories found.");
                return;
            }

            let message = "📂 Your Categories\n\n";

            categories.forEach((category, index) => {
                message += `${index + 1}. ${category.name}\n`;
            });

            await ctx.reply(message);
        }

        async hardDelete(
                id: string,
                userId: Types.ObjectId,
            ) {

                return this.categoryRepository.deleteOne({

                    filter: {
                        _id: id,
                        userId,
                        paranoid: false,
                        deletedAt: {
                            $ne: null,
                        },
                        force: true,
                    },

                });

            }
        


}