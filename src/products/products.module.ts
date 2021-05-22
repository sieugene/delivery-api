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
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsSearchService, ProductsResolver],
})
export class ProductsModule {}
