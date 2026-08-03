import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryRepository } from '../../common/repository/category.repository';
import { CategoryModel } from '../../DB/category.model copy';
import { ConversationModule } from '../conversation/conversation.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        CategoryModel,
        forwardRef(() => ConversationModule),
        forwardRef(() => UsersModule),

    ],

    providers: [
        CategoriesService,
        CategoryRepository,
    ],

    exports: [
        CategoriesService,
        CategoryRepository,
    ],
})
export class CategoriesModule {}
