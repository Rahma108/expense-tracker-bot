import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from './base.repository';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IExpense } from '../interfaces';
import { Expense } from '../../DB/expense.model';
@Injectable()
export class ExpenseRepository extends BaseRepository<IExpense> {
  constructor(@InjectModel(Expense.name) protected readonly model: Model<IExpense>) {
    super(model);
  }

    async findUserExpenses(
        userId: Types.ObjectId,
        page = 1,
        size = 10,
    ) {
        return this.paginate({
            page,
            size,
            filter: {
                userId,
                deletedAt: null,
            },
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
    }

   async findDeletedExpenses(userId: Types.ObjectId) {
        return this.find({
            filter: {
            paranoid: false,
            userId,
            deletedAt: {
                $ne: null,
            },
            } as any,
        });
        }

}
