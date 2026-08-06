import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import { ExpensesService } from "../expenses/expense.service";
import { UserRepository } from "../../common/repository";
import { ExpenseRepository } from "../../common/repository/expense.repository";
import { AiService } from "../ai/ai.service";

@Injectable()
export class ReportsService {

    constructor(
        private readonly expensesService: ExpensesService,
        private readonly usersRepository: UserRepository,
        private readonly expenseRepository: ExpenseRepository,
        private readonly aiService: AiService,

    ) {}

    async report(ctx: Context) {

        const telegramId = ctx.from!.id;

        const user =
            await this.usersRepository.findByTelegramId(
                telegramId,
            );

        if (!user) {
            await ctx.reply("❌ User not found.");
            return;
        }

        const [
            total,
            transactions,
            highest,
            lowest,
            categories,
            average,
            topCategory,
                ] = await Promise.all([

            this.expensesService.getTotalExpenses(user._id),
            this.expensesService.getTotalTransactions(user._id),
            this.expensesService.getHighestExpense(user._id),
            this.expensesService.getLowestExpense(user._id),
            this.expensesService.getExpensesByCategory(user._id),
            this.expensesService.getAverageExpense(user._id),
            this.expensesService.getTopCategory(user._id),

        ]);

            let message = `📊 *Expense Report*\n`;
            message += `━━━━━━━━━━━━━━━━━━\n\n`;

            message += `💰 *Overview*\n`;
            message += `• Total Expenses: ${total} ${user.currency}\n`;
            message += `• Transactions: ${transactions}\n`;
            message += `• Average Expense: ${Number(average).toFixed(2)} ${user.currency}\n\n`;

            if (topCategory) {
                message += `🏆 *Top Category*\n`;
                message += `• ${topCategory._id}\n`;
                message += `• ${topCategory.total} ${user.currency}\n\n`;
            }

            message += `📂 *Categories*\n`;

            for (const category of categories) {
                message += `• ${category._id}\n`;
                message += `   💰 ${category.total} ${user.currency}\n`;
                message += `   📝 ${category.count} transaction(s)\n\n`;
            }

            if (highest) {
                message += `📈 *Highest Expense*\n`;
                message += `• Category: ${highest.category}\n`;
                message += `• Amount: ${highest.amount} ${user.currency}\n`;

                if (highest.note) {
                    message += `• Note: ${highest.note}\n`;
                }

                message += `• Date: ${highest.date?.toLocaleDateString()}\n\n`;
            }


            if (lowest) {
                message += `📉 *Lowest Expense*\n`;
                message += `• Category: ${lowest.category}\n`;
                message += `• Amount: ${lowest.amount} ${user.currency}\n`;

                if (lowest.note) {
                    message += `• Note: ${lowest.note}\n`;
                }

                message += `• Date: ${lowest.date?.toLocaleDateString()}\n`;
            }

        await ctx.reply(message, {
            parse_mode: 'Markdown',
        });

    }


    // stats 


    async stats(ctx: Context){

    const telegramId = ctx.from!.id;


    const user =
    await this.usersRepository.findByTelegramId(
        telegramId
    );


    if(!user){

        await ctx.reply(
            "❌ User not found"
        );

        return;
    }


    const [
        today,
        week,
        month,
        transactions,
        average

    ] = await Promise.all([

        this.expensesService.getTodayExpenses(user._id),

        this.expensesService.getWeekExpenses(user._id),

        this.expensesService.getMonthExpenses(user._id),

        this.expensesService.getTotalTransactions(user._id),

        this.expensesService.getAverageExpense(user._id),

    ]);



        const message = `📊 *Statistics*

            ━━━━━━━━━━━━━━

            📅 Today
            💰 ${today} ${user.currency}


            📆 This Week
            💰 ${week} ${user.currency}


            🗓 This Month
            💰 ${month} ${user.currency}


            📝 Transactions
            ${transactions}


            💵 Average
            ${Number(average).toFixed(2)} ${user.currency}
            `;


                await ctx.reply(
                    message,
                    {
                        parse_mode:'Markdown'
                    }
                );

}

   async insights(ctx: Context) {
    const telegramId = ctx.from!.id;

    const user = await this.usersRepository.findByTelegramId(
        telegramId,
    );

    if (!user) {
        return ctx.reply("❌ User not found");
    }

    const expenses = await this.expenseRepository.find({
        filter: {
            userId: user._id,
            deletedAt: null,
        },
    });

    if (!expenses.length) {
        return ctx.reply("❌ No expenses found.");
    }

    const expensesForAI = expenses.map((expense) => ({
        amount: expense.amount,
        category: expense.category,
        note: expense.note,
        merchant: expense.merchant,
        date: expense.date,
        currency: expense.currency,
    }));

    const result = await this.aiService.generateInsights(
        expensesForAI,
    );

   await ctx.reply(
`
🤖 *Smart Spending Insights*

━━━━━━━━━━━━━━

📊 *Summary*
${result.summary}

🏆 *Top Category*
${result.topCategory}

⚠️ *Budget Status*
${result.warning}

💡 *Recommendations*

${result.tips.map(t => `• ${t}`).join('\n')}

━━━━━━━━━━━━━━
`,
{
    parse_mode: "Markdown",
},
);

}

   async forecast(ctx: Context) {
    const telegramId = ctx.from!.id;

    const user = await this.usersRepository.findByTelegramId(telegramId);

    if (!user) {
        return ctx.reply("❌ User not found");
    }

    const spent = await this.expensesService.getCurrentMonthTotal(user._id);

    const allExpenses =await this.expensesService.findAllByUser(user._id);
    const expenses = allExpenses.filter(
    expense => expense.currency === user.currency,
);
    const forecast =await this.aiService.forecast(expenses);

   await ctx.reply(
`
📈 *Monthly Forecast*

💸 Current Spending
${spent} ${user.currency}

📊 Expected Spending
${forecast.forecast} ${user.currency}

🎯 Confidence
${forecast.confidence}

📝 Reason
${forecast.reason}
`,
{
    parse_mode: "Markdown",
}
);
}

}