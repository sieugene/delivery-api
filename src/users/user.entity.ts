import { Exclude, Type } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  @Type(() => String)
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  @Type(() => String)
  public password: string;
}

export default User;
