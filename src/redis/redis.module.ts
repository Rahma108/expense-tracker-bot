import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
     useFactory: async (configService: ConfigService) => {

      const redisUrl = configService.get<string>('REDIS_URL');




      if (!redisUrl) {
        throw new Error('REDIS_URL is missing');
      }


      const client = createClient({
        url: redisUrl,
      });


    client.on('connect', () => {
      console.log('✅ Redis Connected');
    });

    client.on('ready', () => {
      console.log('🚀 Redis Ready');
    });

    client.on('error', (err) => {
      console.log('❌ Redis Error', err);
    });
    await client.connect();
    console.log('✅ Redis connection established');

  return client;
},
    },

    RedisService,
  ],

  exports: [
  RedisService,
  'REDIS_CLIENT'
],
})
export class RedisModule {}