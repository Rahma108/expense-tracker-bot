import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from 'src/DB/user.model';
import { UserRepository } from 'src/common/repository/user.repository';

@Module({

  imports :[
    UserModel
  ] ,
  providers: [UsersService , UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
