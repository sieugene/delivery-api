import Products from 'src/products/products.entity';
import User from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @ManyToOne(() => Products, (products: Products) => products.comments)
  public product: Products;

  @ManyToOne(() => User, (author: User) => author.products)
  public author: User;
}
export default Comment;
