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


        return this.categoryRepository.deleteOne({

        filter:{
        _id:id,
        userId,
        }

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
        


}