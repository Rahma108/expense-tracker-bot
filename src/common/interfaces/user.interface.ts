export interface IUser {
    telegramId: number;
    firstName: string;
    lastName: string;
    username?: string;
    currency?: string;

    deletedAt?:Date ;
    restoredAt?:Date;
}