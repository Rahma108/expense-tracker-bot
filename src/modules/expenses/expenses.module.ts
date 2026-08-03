import { forwardRef, Module } from '@nestjs/common';
import { ExpenseModel } from '../../DB/expense.model';
import { ConversationModule } from '../conversation/conversation.module';
import { ExpensesService } from './expense.service';
import { ExpenseRepository } from '../../common/repository/expense.repository';
import { ExpenseAmountHandler } from '../conversation/handlers/add-expense-amount.handler';
import { UsersModule } from '../users/users.module';

 @Module({
  imports: [
    ExpenseModel,
    forwardRef(() => ConversationModule),
    UsersModule 
  ],
    providers:[
        ExpenseRepository,
        ExpensesService, 
        ExpenseAmountHandler,

        
    ],


    exports:[
        ExpensesService,
        ExpenseRepository,  
    ],
})
export class ExpensesModule {}

