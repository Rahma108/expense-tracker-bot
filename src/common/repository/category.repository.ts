import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from './base.repository';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ICategory } from '../interfaces';
import { Category } from '../../DB/category.model copy';
@Injectable()
export class CategoryRepository extends BaseRepository<ICategory> {
  constructor(@InjectModel(Category.name) protected readonly model: Model<ICategory>) {
    super(model);
  }

}
