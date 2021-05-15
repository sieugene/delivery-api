import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/user.entity';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ProductNotFoundException } from './exception/productNotFound.exception';
import Products from './products.entity';
import ProductsSearchService from './productsSearch.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private service: Repository<Products>,
    private productsSearchService: ProductsSearchService,
  ) {}

  async getAllProducts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Products>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.service.count();
    }

    const [items, count] = await this.service.findAndCount({
      where,
      relations: ['author'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });
    return { items, count: startId ? separateCount : count };
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
  async createProduct(product: CreateProductDto, user: User) {
    const newProduct = await this.service.create({
      ...product,
      author: user,
    });
    await this.service.save(newProduct);
    await this.productsSearchService.indexProduct(newProduct);
    return newProduct;
  }
  async updateProduct(id: number, product: UpdateProductDto) {
    await this.service.update(id, product);
    const updatedProduct = await this.service.findOne(id, {
      relations: ['author'],
    });
    if (updatedProduct) {
      await this.productsSearchService.update(updatedProduct);
      return updatedProduct;
    }
    throw new ProductNotFoundException(id);
  }
  async deleteProduct(id: number) {
    const deleteResponse = await this.service.delete(id);
    if (!deleteResponse.affected) {
      throw new ProductNotFoundException(id);
    }
    await this.productsSearchService.remove(id);
  }
  async searchForProducts(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    const { results } = await this.productsSearchService.search(
      text,
      offset,
      limit,
      startId,
    );
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.service.find({ where: { id: In(ids) } });
  }
  async getProductsWithAddition(addition: string) {
    return this.service.query(
      'SELECT * from products WHERE $1 = ANY(addition)',
      [addition],
    );
  }
}
