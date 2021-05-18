import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateProductCategoryDto from './dto/createProductCategory.dto';
import ProductCategory from './product-categories.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productsCategoriesRepository: Repository<ProductCategory>,
  ) {}

  getAllProductCategories() {
    return this.productsCategoriesRepository.find();
  }

  async createProductCategory(category: CreateProductCategoryDto) {
    const newProductCategory = await this.productsCategoriesRepository.create(
      category,
    );
    await this.productsCategoriesRepository.save(newProductCategory);
    return newProductCategory;
  }

  async getAllBrands() {
    return this.productsCategoriesRepository.query(
      `SELECT properties ->'brand' as brand from extra_product`,
    );
  }
  async getBrand(productId: number) {
    return this.productsCategoriesRepository.query(
      `SELECT properties ->'brand' as brand from extra_product WHERE id = $1`,
      [productId],
    );
  }
}
