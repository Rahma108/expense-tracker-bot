export interface IUser {
    telegramId: number;
    firstName: string;
    username?: string;
    currency?: string;

    deletedAt?:Date ;
    restoredAt?:Date;
}