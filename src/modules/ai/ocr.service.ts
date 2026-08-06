import { Injectable } from '@nestjs/common';
import { recognize } from 'tesseract.js';

@Injectable()
export class OcrService {

   async extractText(imagePath: string): Promise<string> {

        const result = await recognize(
            imagePath,
            "eng",
        );

        return result.data.text;

    }
    async extractFromTelegram(url: string) {
    // Download image
    // Run Tesseract
    // Return extracted text
}

}