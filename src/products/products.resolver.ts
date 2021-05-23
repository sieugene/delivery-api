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
  Subscription,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from 'src/authentication/graphql-jwt-auth.guard';
import { CreatePostInput } from './models/products.input';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { User } from 'src/users/models/user.model';
import ProductsLoaders from './loaders/product.loaders';
import { PUB_SUB } from 'src/pub-sub/pub-sub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
const PRODUCT_ADDED_EVENT = 'productAdded';
@Resolver(() => Products)
export class ProductsResolver {
  constructor(
    private productsService: ProductsService,
    private productsLoader: ProductsLoaders,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}
  @Subscription(() => Products)
  productAdded() {
    return this.pubSub.asyncIterator(PRODUCT_ADDED_EVENT);
  }

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
    const newProduct = await this.productsService.createProduct(
      createPostInput,
      context.req.user,
    );
    await this.pubSub.publish(PRODUCT_ADDED_EVENT, {
      productAdded: newProduct,
    });
    return newProduct;
  }
}
