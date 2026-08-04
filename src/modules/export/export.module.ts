import { Module } from "@nestjs/common";
import { ExpensesModule } from "../expenses/expenses.module";
import { UsersModule } from "../users/users.module";
import { ExportService } from "./export.service";

@Module({

imports:[
    UsersModule,
    ExpensesModule,
],

providers:[
    ExportService,
],

exports:[
    ExportService,
],

})

export class ExportModule {}