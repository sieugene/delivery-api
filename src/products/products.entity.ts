import { Type } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from '../categories/categories.entity';

@Entity()
class Products {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @ManyToMany((type) => Category, (category) => category.products)
  @JoinTable()
  @Type(() => Category)
  categories: Category[];
}

export default Products;
