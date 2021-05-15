import {
  Body,
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
import FindOneParams from 'src/utils/findOneParams';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductsService } from './products.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductsController {
  constructor(private readonly producstService: ProductsService) {}
  @Get('')
  async getProducts(@Query('search') search: string) {
    console.log(search, '!!!!!!');

    if (search) {
      return this.producstService.searchForProducts(search);
    }
    return this.producstService.getAllProducts();
  }
  @Get(':id')
  async getProductById(@Param() { id }: FindOneParams) {
    return this.producstService.getProductById(Number(id));
  }
  @UseGuards(JwtAuthenticationGuard)
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
