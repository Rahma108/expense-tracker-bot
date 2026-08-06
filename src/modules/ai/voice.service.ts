import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';


@Injectable()
export class VoiceService {


private readonly ai: OpenAI;


constructor(
private readonly configService: ConfigService,
){

this.ai = new OpenAI({
apiKey:
this.configService.getOrThrow(
'OPENROUTER_API_KEY'
)
});

}



async transcribe(
filePath:string
){

const result =
await this.ai.audio.transcriptions.create({

model:"whisper-1",

file:createReadStream(filePath),

});


return result.text;

}


}