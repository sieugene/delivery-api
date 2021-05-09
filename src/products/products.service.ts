import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductNotFoundException } from './exception/productNotFound.exception';
import Products from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private service: Repository<Products>,
  ) {}

  getAllProducts() {
    return this.service.find({ relations: ['categories'] });
  }
  async getProductById(id: number) {
    const product = await this.service.findOne(id, {
      relations: ['categories'],
    });
    if (product) {
      return product;
    }
    throw new ProductNotFoundException(id);
  }
  async createProduct(product: CreateProductDto) {
    const newProduct = await this.service.create(product);
    await this.service.save(newProduct);
    return newProduct;
  }
  async updateProduct(id: number, product: UpdateProductDto) {
    await this.service.update(id, product);
    const updatedProduct = await this.service.findOne(id, {
      relations: ['categories'],
    });
    if (updatedProduct) {
      return updatedProduct;
    }
    throw new ProductNotFoundException(id);
  }
  async deleteProduct(id: number) {
    const deleteResponse = await this.service.delete(id);
    if (!deleteResponse.affected) {
      throw new ProductNotFoundException(id);
    }
  }
}
