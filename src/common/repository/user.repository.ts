import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from './base.repository';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces';
import { HUserDocument, User } from 'src/DB/user.model';
@Injectable()
export class UserRepository extends BaseRepository<IUser> {
  constructor(@InjectModel(User.name) protected readonly model: Model<IUser>) {
    super(model);
  }

    async findByTelegramId(telegramId: number): Promise<HUserDocument | null>  {
      return this.model.findOne( {filter : {telegramId } });
  }
}
