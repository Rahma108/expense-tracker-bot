import { Types } from 'mongoose';


export interface ICategory {

    name:string;

    userId:Types.ObjectId;

    isDefault?:boolean;

     deletedAt?: Date;
    restoredAt?: Date;

}