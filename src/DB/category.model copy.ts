import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ICategory } from '../common/interfaces';
export type HCategoryDocument = HydratedDocument<ICategory>;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true,
  strictQuery: true,
})
export class Category implements ICategory {

   @Prop({
        type :String ,
        required:true,
        trim:true,
    })
    name!:string;



    @Prop({
        type:Types.ObjectId,
        ref:'User',
        required:true,
    })
    userId!:Types.ObjectId;



    @Prop({
       type :Boolean ,
        default:false,
    })
    isDefault?:boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date;

  @Prop({
    type: Date,
    default: null,
  })
  restoredAt?: Date;
}

export const CategoryMongooseSchema = SchemaFactory.createForClass(Category);
export const CategoryModel = MongooseModule.forFeatureAsync([
  {
    name: Category.name,

    useFactory: () => {
      CategoryMongooseSchema.pre(
    ['find','findOne'],
    function(){

        if(this.getQuery().paranoid === false){
            return;
        }


        this.setQuery({

            ...this.getQuery(),

            deletedAt:null,

        });

});

  CategoryMongooseSchema.pre(
    ['updateOne', 'findOneAndUpdate'],
    function () {
      const update = this.getUpdate() as HydratedDocument<ICategory>;

      if (update.deletedAt) {
        this.setQuery({
          ...this.getQuery(),
          deletedAt: null,
        });

        this.setUpdate({
          ...this.getUpdate(),
          $unset: { restoredAt: 1 },
        });
      }

      if (update.restoredAt) {
        this.setQuery({
          ...this.getQuery(),
          paranoid: false,
          deletedAt: { $ne: null },
        });
      }
    },
  );

  CategoryMongooseSchema.pre(
    ['deleteOne', 'findOneAndDelete'],
    function () {
      if (this.getQuery().force === true) {
        return;
      }

      this.setQuery({
        ...this.getQuery(),
        deletedAt: { $ne: null },
      });
    },
  );


    return CategoryMongooseSchema;
    },
  },
]);
