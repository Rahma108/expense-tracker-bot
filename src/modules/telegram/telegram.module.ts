import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf/dist/telegraf.module';
import { TelegramUpdate } from './telegram.update';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TelegrafModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
            token: config.get<string>('BOT_TOKEN')!,
        }),
        }),
        UsersModule
    ],
    providers: [TelegramUpdate],
})
export class TelegramModule {}