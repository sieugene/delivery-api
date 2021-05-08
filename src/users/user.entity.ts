import { Type } from 'class-transformer';
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
  public password: string;

  // Serialize no work, this case is success, but you need create new instance when return data
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    delete this.password;
  }
}

export default User;
