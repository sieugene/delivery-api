import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import Products from './products.entity';
import { SearchModule } from 'src/search/search.module';
import ProductsSearchService from './productsSearch.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
    TypeOrmModule.forFeature([Products]),
    SearchModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsSearchService],
})
export class ProductsModule {}
