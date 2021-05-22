import { Products } from './models/products.model';
import { ProductsService } from './products.service';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from 'src/authentication/graphql-jwt-auth.guard';
import { CreatePostInput } from './models/products.input';
import RequestWithUser from 'src/authentication/requestWithUser.interface';

@Resolver(() => Products)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}
  @Query(() => [Products])
  async products() {
    const products = await this.productsService.getAllProducts();
    return products.items;
  }

  @Mutation(() => Products)
  @UseGuards(GraphqlJwtAuthGuard)
  async createProduct(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    console.log(createPostInput);

    return this.productsService.createProduct(
      createPostInput,
      context.req.user,
    );
  }
}
