import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from './base.repository';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces';
import { HUserDocument, User } from '../../DB/user.model';
@Injectable()
export class UserRepository extends BaseRepository<IUser> {
  constructor(@InjectModel(User.name) protected readonly model: Model<IUser>) {
    super(model);
  }

   async findByTelegramId(
      telegramId: number,
    ): Promise<HUserDocument | null> {
      return this.findOne({
        filter: { telegramId },
      });
    }

    async createUser(data: IUser): Promise<HUserDocument> {
  return this.createOne({
    data,
  });
}


    async updateBudget(
        userId: Types.ObjectId,
        monthlyBudget: number,
    ) {

        return this.updateOne({

            filter: {
            _id: userId,
        },

        update: {
            monthlyBudget,
        },

    });

}
}
