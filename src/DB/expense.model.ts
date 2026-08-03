import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IExpense } from '../common/interfaces';
export type HExpenseDocument = HydratedDocument<IExpense>;
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strict: true,
  strictQuery: true,
})
export class Expense implements IExpense {

  @Prop({
        type: Types.ObjectId,
        ref:'User',
        required:true,
    })
    userId!: Types.ObjectId;



    @Prop({
        type:Number,
        required:true,
    })
    amount!: number;



    @Prop({
        type:String,
        required:true,
    })
    category!: string;



    @Prop({
        type:String,
        default:null,
    })
    note?:string;



    @Prop({
        type:Date,
        default:Date.now,
    })
    date?:Date;



    @Prop({
        type:String,
        default:'EGP',
    })
    currency?:string;

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

export const ExpenseMongooseSchema = SchemaFactory.createForClass(Expense);
export const ExpenseModel = MongooseModule.forFeatureAsync([
  {
    name: Expense.name,

    useFactory: () => {
      ExpenseMongooseSchema.pre(
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

  ExpenseMongooseSchema.pre(
    ['updateOne', 'findOneAndUpdate'],
    function () {
      const update = this.getUpdate() as HydratedDocument<IExpense>;

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

  ExpenseMongooseSchema.pre(
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


    return ExpenseMongooseSchema;
    },
  },
]);
