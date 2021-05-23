import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import Products from './products.entity';
import { SearchModule } from 'src/search/search.module';
import ProductsSearchService from './productsSearch.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsResolver } from './products.resolver';
import { UsersModule } from 'src/users/users.module';
import ProductsLoaders from './loaders/product.loaders';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
    }),
    TypeOrmModule.forFeature([Products]),
    SearchModule,
    UsersModule,
    PubSubModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsSearchService,
    ProductsResolver,
    ProductsLoaders,
  ],
})
export class ProductsModule {}
