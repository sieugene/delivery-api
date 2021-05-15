import { Type } from 'class-transformer';
import User from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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

  @ManyToOne(() => User, (author: User) => author.products)
  public author: User;

  @RelationId((products: Products) => products.author)
  public authorId: number;
}

export default Products;
