import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCommentHandler } from './commands/handlers/createComment.handler';
import { CommentController } from './comment.controller';
import Comment from './comment.entity';
import { GetCommentsHandler } from './queries/handlers/getComments.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  providers: [CreateCommentHandler, GetCommentsHandler],
  controllers: [CommentController],
})
export class CommentModule {}
