import { Type } from 'class-transformer';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Products from '../products/products.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => Products, (products) => products.categories, {
    cascade: true,
  })
  @Type(() => Products)
  products: Products[];
}

export default Category;
