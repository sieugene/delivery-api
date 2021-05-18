import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateExtraProduct from './dto/createExtraProduct.dto';
import ExtraProduct from './extra-products.entity';

@Injectable()
export class ExtraProductsService {
  constructor(
    @InjectRepository(ExtraProduct)
    private extraProductsRepository: Repository<ExtraProduct>,
  ) {}

  getAllProducts() {
    return this.extraProductsRepository.find();
  }

  async createProduct(product: CreateExtraProduct) {
    const newProduct = await this.extraProductsRepository.create(product);
    await this.extraProductsRepository.save(newProduct);
    return newProduct;
  }
}
