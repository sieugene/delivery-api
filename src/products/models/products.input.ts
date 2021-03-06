import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => [String])
  addition: string[];

  @Field({ nullable: true })
  scheduleDate?: Date;
}
