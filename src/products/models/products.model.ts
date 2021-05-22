import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Products {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => [String])
  addition: string[];
}
