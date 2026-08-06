import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";

import { VoiceService } from "../../ai/voice.service";
import { AiService } from "../../ai/ai.service";
import { ExpensesService } from "../../expenses/expense.service";
import { UserRepository } from "../../../common/repository";
import { ConversationState } from "../../../common/enums";
import { IConversationHandler } from "../../../common/interfaces";


@Injectable()
export class  VoiceExpenseHandler 
implements IConversationHandler{


    state = ConversationState.VOICE_EXPENSE;


    constructor(
        private readonly voiceService: VoiceService,
        private readonly aiService: AiService,
        private readonly expensesService: ExpensesService,
        private readonly userRepository: UserRepository,
    ) {}



    async handle(ctx: Context) {


        console.log("🎤 VOICE HANDLER START");


        const telegramId = ctx.from!.id;


        const message = ctx.message;


        console.log("MESSAGE:", message);



        if (!message || !('voice' in message)) {

            console.log("❌ No voice message");

            await ctx.reply(
                "❌ Please send a voice message"
            );

            return;
        }



        console.log("✅ Voice detected");



        await ctx.reply(
            "🎤 Processing voice..."
        );



        const voice = message.voice;



        console.log(
            "VOICE FILE ID:",
            voice.file_id
        );



        const file =
        await ctx.telegram.getFile(
            voice.file_id
        );



        console.log(
            "TELEGRAM FILE:",
            file
        );



        const filePath =
        `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;



        console.log(
            "FILE PATH:",
            filePath
        );



        const text =
        await this.voiceService.transcribe(
            filePath
        );



        console.log(
            "📝 TRANSCRIPT:",
            text
        );



        if(!text){

            await ctx.reply(
                "❌ Could not understand voice"
            );

            return;
        }



        const expense =
        await this.aiService.extractExpense(
            text
        );



        console.log(
            "🤖 AI RESULT:",
            expense
        );



        const user =
        await this.userRepository.findByTelegramId(
            telegramId
        );



        console.log(
            "👤 USER:",
            user
        );



        if(!user){

            await ctx.reply(
                "❌ User not found. Please register first."
            );

            return;
        }




        await this.expensesService.createExpense({

            userId: user._id,

            amount: expense.amount,

            category: expense.category ?? "Other",

            note: expense.note,

            currency: user.currency ?? "EGP",

        });



        console.log(
            "✅ EXPENSE CREATED"
        );



        await ctx.reply(
`
✅ Voice Expense Added

💰 Amount: ${expense.amount} ${user.currency}

📂 Category: ${expense.category}

📝 Note: ${expense.note ?? "No note"}
`
        );


    }

}