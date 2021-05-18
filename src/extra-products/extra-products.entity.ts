import { BookProperties } from 'src/book/bookProperties.interface';
import { CarProperties } from 'src/car/carProperties.interface';
import ProductCategory from 'src/product-categories/product-categories.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class ExtraProduct {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(
    () => ProductCategory,
    (category: ProductCategory) => category.extraProducts,
  )
  public category: ProductCategory;

  @Column({
    type: 'jsonb',
  })
  public properties: CarProperties | BookProperties;
}
export default ExtraProduct;
