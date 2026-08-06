import { Injectable } from "@nestjs/common";
import { IConversationHandler } from "../../../common/interfaces";
import { ConversationState } from "../../../common/enums";
import { Context } from "telegraf";


import { join } from "path";
import { downloadImage } from "../../../common/utils/download-image";
import { OcrService } from "../../ai/ocr.service";
import { AiService } from "../../ai/ai.service";
import { ExpensesService } from "../../expenses/expense.service";
import { UserRepository } from "../../../common/repository";
import { RedisKeys, RedisService } from "../../../redis/redis.service";
@Injectable()
export class ScanReceiptHandler implements IConversationHandler {

    constructor(
    private readonly ocrService: OcrService,
 private readonly aiService : AiService  , 
  private readonly usersRepository: UserRepository,
  private readonly redisService: RedisService,
) {}

    state =
    ConversationState.SCAN_RECEIPT_WAITING_IMAGE;


    async handle(ctx: Context) {
       console.log("ScanReceiptHandler called");
    if (
        !ctx.message ||
        !("photo" in ctx.message)
    ) {

        await ctx.reply(

            "📷 Please send an image.",

        );

        return;
    }

    console.log(ctx.message.photo);

    const photo =ctx.message.photo[ctx.message.photo.length - 1];

    const url =await ctx.telegram.getFileLink(photo.file_id,);
    console.log(url.toString());

    const imagePath = join(process.cwd(),"uploads","receipt.jpg",);
    await downloadImage(url.toString(),imagePath,);
    await ctx.reply("📥 Receipt downloaded");
    await ctx.reply("🔍 Reading receipt...");

    try {

            const text =
            await this.ocrService.extractText(
                imagePath,
            );

            console.log(text);

            if (!ctx.from) {
                throw new Error('Telegram user not found');
            }

            const telegramId = ctx.from.id;

            const user = await this.usersRepository.findByTelegramId(
                telegramId
            );

            const result = await this.aiService.parseReceipt(text);

            if (!user) {
                    throw new Error('User not found');
                }

                await this.redisService.set({
                key: RedisKeys.expenseDraft(telegramId),
                value: result,
                ttl: 300,
            });



            console.log(
                await this.redisService.get(
                RedisKeys.expenseDraft(telegramId)
                )
);
      
            await ctx.reply("🧾 Receipt analyzed successfully");

         await ctx.reply(
                `
                🧾 <b>Receipt Preview</b>

                🏪 <b>Merchant:</b>
                ${result.merchant ?? '-'}


                💰 <b>Amount:</b>
                ${result.amount ?? '-'} ${result.currency ?? ''}


                📂 <b>Category:</b>
                ${result.category ?? '-'}


                📅 <b>Date:</b>
                ${result.date ?? '-'}


                📝 <b>Note:</b>
                ${result.note ?? '-'}


                Do you want to save this expense?
                `,
                {
                parse_mode:'HTML',
                reply_markup:{
                inline_keyboard:[
                [
                {
                text:'✅ Save',
                callback_data:'receipt_save'
                },
                {
                text:'❌ Cancel',
                callback_data:'receipt_cancel'
                }
                ]
                ]
                }
                }
                );
        } catch (error) {

            console.error(error);

            await ctx.reply(
                "❌ Failed to read receipt.",
            );

}



}
}