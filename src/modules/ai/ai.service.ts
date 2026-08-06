import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OcrService } from './ocr.service';
import { RECEIPT_SYSTEM_PROMPT } from './prompts/receipt.prompt';
import { ReceiptDto } from './dto/receipt.dto';

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

            }