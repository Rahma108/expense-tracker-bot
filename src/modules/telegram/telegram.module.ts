import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf/dist/telegraf.module';
import { TelegramUpdate } from './telegram.update';
import { UsersModule } from '../users/users.module';
import { ConversationModule } from '../conversation/conversation.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { CategoriesModule } from '../categories/categories.module';

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
        

    ],
    providers: [TelegramUpdate],
})
export class TelegramModule {}