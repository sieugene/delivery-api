import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import Products from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private service: Repository<Products>,
  ) {}
  getAllProducts() {
    return this.service.find();
  }
  async getProductById(id: number) {
    const product = await this.service.findOne(id);
    if (product) {
      return product;
    }
    throw new HttpException('product not found', HttpStatus.NOT_FOUND);
  }
  async createProduct(product: CreateProductDto) {
    const newProduct = await this.service.create(product);
    await this.service.save(newProduct);
    return newProduct;
  }
  async updateProduct(id: number, product: UpdateProductDto) {
    await this.service.update(id, product);
    const updatedProduct = await this.service.findOne(id);
    if (updatedProduct) {
      return updatedProduct;
    }
    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }
  async deleteProduct(id: number) {
    const deleteResponse = await this.service.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }
}
