import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from 'src/DB/user.model';

@Module({

  imports :[
    UserModel
  ] ,
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
