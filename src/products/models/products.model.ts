import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Products {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => [String])
  addition: string[];

  @Field(() => Int)
  authorId: number;

  @Field()
  author: User;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  scheduleDate?: Date;
}
