import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import Comment from 'src/comment/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentCommand } from '../implementations/createComment.command';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async execute(command: CreateCommentCommand) {
    const newProduct = await this.commentsRepository.create({
      ...command.comment,
      author: command.author,
    });
    await this.commentsRepository.save(newProduct);
    return newProduct;
  }
}
