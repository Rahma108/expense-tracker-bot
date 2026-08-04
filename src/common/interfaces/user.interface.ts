export interface IUser {
    telegramId: number;
    firstName: string;
    lastName: string;
    username?: string;
    currency?: string;

    monthlyBudget?: number;


    deletedAt?:Date ;
    restoredAt?:Date;
}