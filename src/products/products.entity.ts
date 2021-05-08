import { Transform, Type } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Products {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ nullable: true })
  @Type(() => String)
  @Transform(({ value }) => {
    if (value !== null) {
      return value;
    }
  })
  public category?: string;
}

export default Products;
