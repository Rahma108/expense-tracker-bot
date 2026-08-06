import { Module } from '@nestjs/common';

import { ExpensesModule } from '../expenses/expenses.module';
import { UsersModule } from '../users/users.module';
import { ReportsService } from './reports.service';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [
        ExpensesModule,
        UsersModule,
        AiModule,

    ],
    providers: [
        ReportsService,
    ],
    exports: [
        ReportsService,
    ],
})
export class ReportsModule {}