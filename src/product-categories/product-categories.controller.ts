import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import CreateProductCategoryDto from './dto/createProductCategory.dto';
import { ProductCategoriesService } from './product-categories.service';

@Controller('product-categories')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductCategoriesController {
  constructor(
    private readonly productsCategoriesService: ProductCategoriesService,
  ) {}

  @Get()
  getAllProducts() {
    return this.productsCategoriesService.getAllProductCategories();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() productCategory: CreateProductCategoryDto) {
    return this.productsCategoriesService.createProductCategory(
      productCategory,
    );
  }

  @Get('/brands')
  async getAllBrands() {
    return this.productsCategoriesService.getAllBrands();
  }
}
