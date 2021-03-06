import {
  Body,
  CacheKey,
  CacheTTL,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import JwtTwoFactorGuard from 'src/two-factor-authentication/jwtTwoFactorStrategy.guard';
import { GET_PRODUCT_CACHE_KEY } from 'src/utils/constants/productsCacheKey.constant';
import FindOneParams from 'src/utils/findOneParams';
import { HttpCacheInterceptor } from 'src/utils/interceptors/httpCache.interceptor';
import { CreateProductDto } from './dto/createProduct.dto';
import { PaginationParams } from './dto/paginationParams.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductsService } from './products.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly producstService: ProductsService) {}
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_PRODUCT_CACHE_KEY)
  @CacheTTL(120)
  @Get('')
  async getProducts(
    @Query('search') search: string,
    @Query() { offset, limit, startId }: PaginationParams,
  ) {
    if (search) {
      return this.producstService.searchForProducts(
        search,
        offset,
        limit,
        startId,
      );
    }
    return this.producstService.getAllProducts(offset, limit, startId);
  }
  @Get(':addition')
  async getProductsByAddition(@Param('addition') addition: string) {
    return this.producstService.getProductsWithAddition(addition);
  }
  @Get(':id')
  async getProductById(@Param() { id }: FindOneParams) {
    return this.producstService.getProductById(Number(id));
  }
  @UseGuards(JwtTwoFactorGuard)
  @Post('create')
  async createProduct(
    @Req() request: RequestWithUser,
    @Body() dto: CreateProductDto,
  ) {
    return this.producstService.createProduct(dto, request.user);
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
