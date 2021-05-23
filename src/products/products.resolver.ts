import { Products } from './models/products.model';
import { ProductsService } from './products.service';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from 'src/authentication/graphql-jwt-auth.guard';
import { CreatePostInput } from './models/products.input';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { User } from 'src/users/models/user.model';
import ProductsLoaders from './loaders/product.loaders';

@Resolver(() => Products)
export class ProductsResolver {
  constructor(
    private productsService: ProductsService,
    private productsLoader: ProductsLoaders,
  ) {}
  @Query(() => [Products])
  async products() {
    const products = await this.productsService.getAllProducts();
    return products.items;
  }

  @ResolveField('author', () => User)
  async getAuthor(@Parent() products: Products) {
    const { authorId } = products;
    return this.productsLoader.batchAuthors.load(authorId);
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
