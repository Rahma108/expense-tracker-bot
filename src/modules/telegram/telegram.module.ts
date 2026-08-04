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

@Module({
    imports: [
        TelegrafModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            token: config.get<string>('BOT_TOKEN')!,
        }),
        }),
        UsersModule,
        ConversationModule ,
        ExpensesModule ,
        CategoriesModule,
        ReportsModule ,
        ExportModule
        

    ],
    providers: [TelegramUpdate],
})
export class TelegramModule {}