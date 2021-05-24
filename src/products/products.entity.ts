import { Type } from 'class-transformer';
import User from 'src/users/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  CreateDateColumn,
} from 'typeorm';
import Category from '../categories/categories.entity';
import Comment from '../comment/comment.entity';

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

  @Index('products_authorId_index')
  @ManyToOne(() => User, (author: User) => author.products)
  public author: User;

  @RelationId((products: Products) => products.author)
  public authorId: number;

  @Column('text', { array: true })
  public addition: string[];

  @OneToMany(() => Comment, (comment: Comment) => comment.product)
  public comments: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduleDate?: Date;
}

export default Products;
