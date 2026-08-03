import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from '../../DB/user.model';
import { UserRepository } from '../../common/repository/user.repository';
import { ConversationModule } from '../conversation/conversation.module';


  @Module({
  imports: [
    UserModel,
    forwardRef(() => ConversationModule),
  ],
  providers: [
    UsersService,
    UserRepository,
  ],
  exports: [
    UsersService,
      UserRepository,
  ],
})
export class UsersModule {}

