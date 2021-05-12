import { Exclude, Type } from 'class-transformer';
import PublicFile from 'src/files/publicFile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './address.entity';

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

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address;

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;
}

export default User;
