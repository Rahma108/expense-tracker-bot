import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './modules/categories/categories.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { UsersModule } from './modules/users/users.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      uri: config.get<string>('DB_URI'),

      connectionFactory: (connection) => {
          console.log('✅ MongoDB Connected Successfully');
          return connection;
        },
        onConnectionCreate: (connection) => {
          connection.on('error', (error) => {
            console.log('❌ MongoDB Connection Failed');
            console.error(error.message);
          });

          return connection;
        } ,
    }),

    
  }),
    CategoriesModule ,
    ReportsModule ,
    ExpensesModule ,
    TelegramModule ,
    UsersModule ,
    ConversationModule,
    RedisModule
    

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
