import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { OcrService } from './ocr.service';
import { VoiceService } from './voice.service';
@Module({
  providers:[
    AiService,
    OcrService,
    VoiceService,
  ],

  exports:[
    AiService,
    OcrService,
    VoiceService,
  ]
})
export class AiModule {}