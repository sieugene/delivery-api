import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import Comment from 'src/comment/comment.entity';
import { Repository } from 'typeorm';
import { GetCommentsQuery } from '../implementations/getComments.query';

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async execute(query: GetCommentsQuery) {
    if (query.productId) {
      return this.commentsRepository.find({
        product: {
          id: query.productId,
        },
      });
    }
    return this.commentsRepository.find();
  }
}
