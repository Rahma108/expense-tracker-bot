import { ConversationState } from "../enums";

export interface IConversationSession {
    
    state: ConversationState;

    createdAt?: Date;

    updatedAt?: Date;


    firstName?: string;

    lastName?: string;

     // Expense selected for Update/Delete
    expenseId?: string;

    // Category
    categoryName?: string;

    
    expenseDraft?: {

        amount?: number;

        category?: string;

        note?: string;

    };
}