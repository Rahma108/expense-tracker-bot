import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

type SetParams = {
  key: string;
  value: unknown
  ttl?: number | undefined;
};

type KeyParam = string;

type ExpireParams = {
  key: string;
  ttl: number;
};
export const RedisKeys = {
  conversation: (telegramId: number) => `conversation:${telegramId}`,
  userSession: (telegramId: number) => `session:${telegramId}`,
  expenseDraft: (telegramId: number) => `expense:draft:${telegramId}`,
  reportCache: (telegramId: number) => `report:${telegramId}`,
};

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly client: RedisClientType,
  ) {
    this.handleEvents();
  }
  getCacheKey(value : string, userId?:string  ){
  return userId ?  `Cart::${value}::${userId.toString()}` : `Cart::${value}`;

}
  private handleEvents() {
    this.client.on('connect', () =>
      console.log(`REDIS_DB CONNECTED SUCCESSFULLY ✔️`),
    );

    this.client.on('error', (error) =>
      console.log(`FAIL TO CONNECT ON REDIS_DB ❌${error}`),
    );

    this.client.on('end', () => {
      console.log('Redis connection closed ❌');
    });

    this.client.on('reconnecting', () => {
      console.log('Redis reconnecting 🔄');
    });
  }

  public connectRedis = async () => {
    try {
      if (this.client.isOpen) return;
      await this.client.connect();
    } catch (error) {
      console.log(`FAIL TO CONNECT ON REDIS_DB ❌${error}`);
    }
  };

  public set = async ({ key, value, ttl }: SetParams): Promise<any> => {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      let result: string | null;
      if (ttl) {
        result = await this.client.set(key, data, { EX: ttl });
      } else {
        result = await this.client.set(key, data);
      }
      return result ?? null;
    } catch (error) {
      console.log(`Fail in redis set Operations ${error}`);
      return null;
    }
  };
  baseRevokeTokenKey = (userId: string): string => {
    return `RevokeToken::${userId}`;
  };

  revokeTokenKey = ({
    userId,
    jti,
  }: {
    userId: string;
    jti: string;
  }): string => {
    return `${this.baseRevokeTokenKey(userId)}::${jti}`;
  };

  public exists = async (key: string) => {
    try {
      return await this.client.exists(key);
    } catch (error) {
      console.log(`Fail in redis Exists Operations ${error}`);
      return;
    }
  };

  public ttl = async (key: string): Promise<number> => {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.log(`Fail in redis TTL Operations ${error}`);
      return -1;
    }
  };

  public expire = async ({ key, ttl }: ExpireParams) => {
    try {
      return await this.client.expire(key, ttl);
    } catch (error) {
      console.log(`Fail in redis Expire Operations ${error}`);
      return;
    }
  };

  public keys = async (prefix: string): Promise<string[]> => {
    try {
      return await this.client.keys(`${prefix}*`);
    } catch (error) {
      console.log(`Fail in redis Prefix Operations ${error}`);
      return [];
    }
  };
  public get = async (key: string): Promise<any> => {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (error) {
      console.log(`Fail in redis get Operations ${error}`);
    }
  };

  public mGet = async (keys: string[] = []): Promise<any[]> => {
    try {
      if (!keys.length) return [];

      return await this.client.mGet(keys);
    } catch (error) {
      console.log(`Fail in redis mGet Operations ${error}`);
      return [];
    }
  };

  public deleteKeys = async (keys: string | string[]): Promise<number> => {
    try {
      if (!keys.length) return 0;
      return await this.client.del(keys);
    } catch (error) {
      console.log(`Fail in redis del Operations ${error}`);
      return 0;
    }
  };

  public update = async ({ key, value, ttl }: SetParams): Promise<any> => {
    try {
      if (!(await this.exists(key))) return 0;
      return this.set({ key, value, ttl });
    } catch (error) {
      console.log(`Fail in redis update Operations ${error}`);
      return null;
    }
  };

  public increment = async (key: KeyParam): Promise<number> => {
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.log(`FAIL IN REDIS INCREMENT OPERATIONS ${error}🫠`);
      return 0;
    }
  };

    // Telegram 

    conversationKey(telegramId:number){

        return `conversation:${telegramId}`;

      }
    userSessionKey(telegramId:number){

      return `session:${telegramId}`;

    }  
    expenseDraftKey(telegramId:number){

      return `expense:draft:${telegramId}`;

    }


}
