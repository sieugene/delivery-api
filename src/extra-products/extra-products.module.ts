import { Module } from '@nestjs/common';
import { ExtraProductsService } from './extra-products.service';
import { ExtraProductsController } from './extra-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ExtraProduct from './extra-products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraProduct])],
  providers: [ExtraProductsService],
  controllers: [ExtraProductsController],
})
export class ExtraProductsModule {}
