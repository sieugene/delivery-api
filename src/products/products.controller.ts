import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly producstService: ProductsService) {}
  @Get('')
  async getAll() {
    return this.producstService.getAllProducts();
  }
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.producstService.getProductById(Number(id));
  }
  @Post('create')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.producstService.createProduct(dto);
  }
  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.producstService.updateProduct(id, dto);
  }
  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.producstService.deleteProduct(id);
  }
}
