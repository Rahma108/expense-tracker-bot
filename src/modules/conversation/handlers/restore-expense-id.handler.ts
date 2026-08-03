import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConversationService } from '../conversation.service';
import { ConversationState } from '../../../common/enums';
import { IConversationHandler } from '../../../common/interfaces';
import { ExpenseRepository } from '../../../common/repository/expense.repository';
import { EXPENSE_MESSAGES } from '../../../common/messages';

@Injectable()
export class RestoreExpenseIdHandler
implements IConversationHandler {


readonly state =
ConversationState.RESTORE_EXPENSE_WAITING_ID;


constructor(
 private readonly conversationService: ConversationService,
 private readonly expenseRepository: ExpenseRepository,
){}



async handle(ctx: Context){

const telegramId = ctx.from!.id;


if(!ctx.message || !('text' in ctx.message)){
 return;
}


const expenseId =
ctx.message.text.trim();



const expense =
await this.expenseRepository.findOne({

filter:{
    paranoid:false,
    _id: expenseId,
    deletedAt:{
        $ne:null,
    },
},

});


if(!expense){

await ctx.reply(
  EXPENSE_MESSAGES.DELETED_EXPENSE_NOT_FOUND,
);

return;

}



await this.expenseRepository.findOneAndUpdate({

filter:{
    _id:expenseId,
},


update:{

    deletedAt:null,

    restoredAt:new Date(),

},

});



await this.conversationService.clearSession(
telegramId,
);


await ctx.reply(
  EXPENSE_MESSAGES.RESTORE_SUCCESS,
);


}


}