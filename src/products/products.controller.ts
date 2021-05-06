import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly producstService: ProductsService) {}
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.producstService.getProductById(Number(id));
  }
  @Post('create')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.producstService.createProduct(dto);
  }
}
