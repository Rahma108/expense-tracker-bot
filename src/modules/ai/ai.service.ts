import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OcrService } from './ocr.service';
import { RECEIPT_SYSTEM_PROMPT } from './prompts/receipt.prompt';
import { ReceiptDto } from './dto/receipt.dto';
import { CategoryDto } from './dto/category.dto';
import { CATEGORY_SYSTEM_PROMPT } from './prompts/category.prompt';
import { CLASSIFY_CATEGORY } from './prompts/classify-expense.prompt';
import { SPENDING_INSIGHTS_PROMPT } from './prompts/insights.prompt';
import { SpendingInsightsDto } from './dto/spending.insights.dto';
import { FORECAST_SYSTEM_PROMPT } from './prompts/forecast.prompt';
import { VOICE_EXPENSE_PROMPT } from './prompts/voice.prompt';

@Injectable()
export class AiService  {

    private readonly ai: OpenAI;

    constructor(
        private readonly configService: ConfigService,
        private readonly ocrService: OcrService,
    ) {

        this.ai = new OpenAI({

            apiKey: this.configService.getOrThrow(
                'OPENROUTER_API_KEY',
            ),

            baseURL: 'https://openrouter.ai/api/v1',

        });

    }
    async parseReceipt(text: string): Promise<ReceiptDto>  {

    const response =
    await this.ai.chat.completions.create({

    model: "google/gemini-2.5-flash",
    max_tokens: 1000,

        messages: [

            {
                role: "system",
                content: RECEIPT_SYSTEM_PROMPT,
                        },

                        {
                            role: "user",
                            content: text,
                        },

                    ],

                });
                const content = response?.choices?.[0]?.message?.content;

                if (!content) {
                    throw new Error("AI returned empty response");
                }

                const cleanContent = content
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                const result = JSON.parse(cleanContent);


                // Fallback: extract amount from OCR text if AI failed
                if (!result.amount) {

                    const amounts = text.match(/[$€£]?\s?\d+\.\d{1,2}/g);

                    if (amounts?.length) {

                        const lastAmount = amounts[amounts.length - 1];

                        result.amount = Number(
                            lastAmount.replace(/[^0-9.]/g, "")
                        );

                        result.currency =
                            lastAmount.match(/[$€£]/)?.[0] ?? null;
                    }
                }


                return result;
    }


    async classifyExpense(text: string): Promise<CategoryDto> {
        const response = await this.ai.chat.completions.create({
            model: 'google/gemini-2.5-flash',
            max_tokens: 100,

            messages: [
            {
                role: 'system',
                content: CATEGORY_SYSTEM_PROMPT,
            },
            {
                role: 'user',
                content: text,
            },
            ],
        });

        const content = response?.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('AI returned empty response');
        }

        const cleanContent = content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        return JSON.parse(cleanContent);
        }

    async suggestCategory(note: string): Promise<string> {
    const response = await this.ai.chat.completions.create({
        model: "google/gemini-2.5-flash",
        max_tokens: 20,

        messages: [
            {
                role: "system",
                content: CLASSIFY_CATEGORY,
            },
            {
                role: "user",
                content: note,
            },
        ],
    });

    const allowedCategories = [
            "Food",
            "Transportation",
            "Shopping",
            "Entertainment",
            "Bills",
            "Healthcare",
            "Education",
            "Travel",
            "Salary",
            "Income",
            "Groceries",
            "Subscription",
            "Other",
            ];

            const category = response.choices[0].message.content?.trim() ?? "Other";

            return allowedCategories.includes(category)
            ? category
            : "Other";
            }

    async generateInsights(
    expenses: any[],
): Promise<SpendingInsightsDto> {

    const response =
    await this.ai.chat.completions.create({

        model: "google/gemini-2.5-flash",

        messages: [

            {
                role: "system",
                content: SPENDING_INSIGHTS_PROMPT,
            },

            {
                role: "user",
                content: JSON.stringify(expenses),
            },

        ],

        max_tokens: 500,

    });

    const content =
    response.choices[0].message.content ?? "";

    return JSON.parse(
        content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim(),
    );
}

    async forecast(expenses: any[]) {

    const response =
    await this.ai.chat.completions.create({

        model: "google/gemini-2.5-flash",
        max_tokens: 200,

        messages: [

            {
                role: "system",
                content: FORECAST_SYSTEM_PROMPT,
            },

            {
                role: "user",
                content: JSON.stringify(expenses),
            },

        ],

    });

    const content =
        response.choices[0].message.content ?? "";

    return JSON.parse(
        content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim(),
    );
}

    async extractExpense(text:string){

                const response =
                await this.ai.chat.completions.create({

                model:"google/gemini-2.5-flash",

                max_tokens:300,

                messages:[

                {
                role:"system",
                content:VOICE_EXPENSE_PROMPT
                },

                {
                role:"user",
                content:text
                }

                ]

                });


                const content =
                response.choices[0].message.content;


                if(!content){
                    throw new Error("AI returned empty response");
                }


                return JSON.parse(
                    content.replace(/```json|```/g,"").trim()
                );

                }
                }