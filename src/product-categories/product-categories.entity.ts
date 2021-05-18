import ExtraProduct from 'src/extra-products/extra-products.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class ProductCategory {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @OneToMany(
    () => ExtraProduct,
    (extraProducts: ExtraProduct) => extraProducts.category,
  )
  extraProducts: ExtraProduct[];
}
export default ProductCategory;
