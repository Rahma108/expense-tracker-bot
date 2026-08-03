import { forwardRef, Module } from '@nestjs/common';
import { RegisterFirstNameHandler } from './handlers/register-first-name.handler';
import { RegisterLastNameHandler } from './handlers/register-last-name.handler';
import { RedisModule } from '../../redis/redis.module';
import { UsersModule } from '../users/users.module';
import { ConversationService } from './conversation.service';
import { ConversationRouterService } from './conversation-router.service';
import { CONVERSATION_HANDLERS } from '../../common/constants';
import { ExpenseAmountHandler } from './handlers/add-expense-amount.handler';
import { ExpenseCategoryHandler } from './handlers/add-expense-category.handler';
import { ExpenseNoteHandler } from './handlers/add-expense-note.handler';
import { ExpensesModule } from '../expenses/expenses.module';
import { DeleteExpenseIdHandler, HardDeleteExpenseIdHandler, RestoreExpenseIdHandler, UpdateExpenseAmountHandler, UpdateExpenseIdHandler, UpdateExpenseNoteHandler } from './handlers';
import { UpdateExpenseCategoryHandler } from './handlers/update-expense-category.handler';
import { AddCategoryHandler } from './handlers/add-category.handler';
import { CategoriesModule } from '../categories/categories.module';


@Module({

imports:[
    RedisModule,
    forwardRef(() => ExpensesModule),
    forwardRef(()=>UsersModule),
    forwardRef(() => CategoriesModule),
    
],

providers:[

    ConversationService,

    ConversationRouterService,


    RegisterFirstNameHandler,
    RegisterLastNameHandler,
    ExpenseAmountHandler,
    ExpenseCategoryHandler,
    ExpenseNoteHandler,
    UpdateExpenseAmountHandler,
    UpdateExpenseCategoryHandler,
    UpdateExpenseNoteHandler,
    UpdateExpenseIdHandler,
    DeleteExpenseIdHandler ,
    RestoreExpenseIdHandler,
    HardDeleteExpenseIdHandler,
    AddCategoryHandler,


    {
        provide: CONVERSATION_HANDLERS,

        useFactory: (
            firstNameHandler:RegisterFirstNameHandler,
            lastNameHandler:RegisterLastNameHandler,
            expenseAmountHandler:ExpenseAmountHandler,
            expenseCategoryHandler:ExpenseCategoryHandler,
            expenseNoteHandler: ExpenseNoteHandler,
            updateExpenseAmountHandler: UpdateExpenseAmountHandler,
            updateExpenseCategoryHandler: UpdateExpenseCategoryHandler,
            updateExpenseNoteHandler: UpdateExpenseNoteHandler,
            updateExpenseIdHandler: UpdateExpenseIdHandler,
            deleteExpenseIdHandler:DeleteExpenseIdHandler,
            restoreExpenseIdHandler:RestoreExpenseIdHandler,
            hardDeleteExpenseIdHandler:HardDeleteExpenseIdHandler,
            addCategoryHandler:AddCategoryHandler
        )=>[
            firstNameHandler,
            lastNameHandler,
            expenseAmountHandler,
            expenseCategoryHandler ,
            expenseNoteHandler,
            updateExpenseAmountHandler,
            updateExpenseCategoryHandler,
            updateExpenseNoteHandler,
            updateExpenseIdHandler ,
            deleteExpenseIdHandler ,
            restoreExpenseIdHandler,
            hardDeleteExpenseIdHandler,
            addCategoryHandler
        ],

        inject:[
            RegisterFirstNameHandler,
            RegisterLastNameHandler,
            ExpenseAmountHandler,
            ExpenseCategoryHandler,
            ExpenseNoteHandler ,
            UpdateExpenseAmountHandler, 
            UpdateExpenseCategoryHandler,
            UpdateExpenseNoteHandler,
            UpdateExpenseIdHandler,
            DeleteExpenseIdHandler,
            RestoreExpenseIdHandler,
            HardDeleteExpenseIdHandler,
            AddCategoryHandler
        ],

    },


],

exports:[
    ConversationService,
    ConversationRouterService,
],

})
export class ConversationModule {}