
import { Types } from 'mongoose';


export interface IExpense {

    userId: Types.ObjectId;
    amount: number;
    category: string;
    note?: string | null;
    date?: Date;
    currency?: string;
    merchant?: string;

    deletedAt?:Date ;
    restoredAt?:Date;

}