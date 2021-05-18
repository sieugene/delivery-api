import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import CreateExtraProduct from './dto/createExtraProduct.dto';
import { ExtraProductsService } from './extra-products.service';

@Controller('extra-products')
export class ExtraProductsController {
  constructor(private readonly extraProductsService: ExtraProductsService) {}

  @Get()
  getAllProducts() {
    return this.extraProductsService.getAllProducts();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() product: CreateExtraProduct) {
    return this.extraProductsService.createProduct(product);
  }
}
