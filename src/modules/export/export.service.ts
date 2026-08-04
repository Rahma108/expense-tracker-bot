import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import { Parser } from "json2csv";

import { UserRepository } from "../../common/repository";
import { ExpensesService } from "../expenses/expense.service";
import PDFDocument = require('pdfkit');

@Injectable()
export class ExportService {


constructor(
    private readonly userRepository: UserRepository,
    private readonly expensesService: ExpensesService,
){}



        async exportExpenses(
            ctx: Context,
            monthly = false,
        ){


        const telegramId =
        ctx.from!.id;


        const user =
        await this.userRepository.findByTelegramId(
            telegramId,
        );



        if(!user){

            await ctx.reply(
                "❌ User not found"
            );

            return;
        }



       let expenses;

        if (monthly) {

            expenses =
            await this.expensesService.getCurrentMonthExpenses(
                user._id,
            );

        } else {

            expenses =
            await this.expensesService.findAll(
                user._id,
            );

        }


        if(!expenses.length){

            await ctx.reply(
                "📂 No expenses found"
            );

            return;
        }



        const data =
        expenses.map(expense => ({

            Date:
            expense.date?.toISOString()
            .split("T")[0],


            Category:
            expense.category,


            Amount:
            expense.amount,


            Currency:
            expense.currency,


            Note:
            expense.note ?? "",

        }));
        const parser = new Parser();
        const csv = parser.parse(data);
        const filename = monthly
    ? "monthly-expenses-report.csv"
    : "all-expenses-report.csv";
        await ctx.replyWithDocument(
            {
                source:
                Buffer.from(csv),
                filename
            },
            {
            caption:
                monthly
                ? "📄 Your monthly expense report"
                : "📄 Your expense report",
            }
        );

        }


        async exportPdf(
            ctx: Context,
        ) {

            const telegramId =
                ctx.from!.id;


            const user =
                await this.userRepository.findByTelegramId(
                    telegramId,
                );


            if(!user){

                await ctx.reply(
                    "❌ User not found"
                );

                return;
            }


            const expenses =
                await this.expensesService.findAll(
                    user._id,
                );


            if(!expenses.length){

                await ctx.reply(
                    "📂 No expenses found"
                );

                return;
            }



            const total =
                expenses.reduce(
                    (sum, expense) =>
                    sum + expense.amount,
                    0,
                );


        const doc =
            new PDFDocument();



        const chunks: Buffer[] = [];


        doc.on(
            'data',
            chunk => chunks.push(chunk),
        );


        doc.on(
            'end',
            async () => {

                const pdf =
                Buffer.concat(chunks);


                await ctx.replyWithDocument(
                    {
                        source: pdf,
                        filename:
                        "expense-report.pdf",
                    },
                    {
                        caption:
                        "📄 Your Expense PDF Report",
                    }
                );

            }
        );



        doc.fontSize(20)
        .text(
            "Expense Tracker Report",
            {
                align:"center"
            }
        );


        doc.moveDown();


        doc.fontSize(12)
        .text(
            `User: ${user.firstName}`,
        );


        doc.text(
            `Currency: ${user.currency}`,
        );


        doc.text(
            `Total Expenses: ${total} ${user.currency}`,
        );


        doc.moveDown();


        doc.text(
            "Expenses:",
        );


        expenses.forEach(
            expense => {

                doc.text(
    `${expense.date?.toISOString().split("T")[0]}
    ${expense.category}
    ${expense.amount} ${expense.currency}
    ${expense.note ?? ""}

    `
                );

            }
        );


        doc.end();

    }



    }