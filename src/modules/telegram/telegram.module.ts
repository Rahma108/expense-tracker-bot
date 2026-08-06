import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf/dist/telegraf.module';
import { TelegramUpdate } from './telegram.update';
import { UsersModule } from '../users/users.module';
import { ConversationModule } from '../conversation/conversation.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { CategoriesModule } from '../categories/categories.module';
import { ReportsModule } from '../reports/reports.module';
import { ExportModule } from '../export/export.module';
import { RedisModule } from '../../redis/redis.module';
import { VoiceExpenseHandler } from '../conversation/handlers/voice-expense.handler';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [
        TelegrafModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            token: config.get<string>('BOT_TOKEN')!,
        }),
        }),

       AiModule,  
        UsersModule,
        ConversationModule ,
        ExpensesModule ,
        CategoriesModule,
        ReportsModule ,
        ExportModule,
        RedisModule,
        
        

    ],
    providers: [TelegramUpdate , VoiceExpenseHandler,],
})
export class TelegramModule {}