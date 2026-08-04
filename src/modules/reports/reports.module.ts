import { Module } from '@nestjs/common';

import { ExpensesModule } from '../expenses/expenses.module';
import { UsersModule } from '../users/users.module';
import { ReportsService } from './reports.service';

@Module({
    imports: [
        ExpensesModule,
        UsersModule,
    ],
    providers: [
        ReportsService,
    ],
    exports: [
        ReportsService,
    ],
})
export class ReportsModule {}