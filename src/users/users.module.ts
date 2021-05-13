import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Address from './address.entity';
import User from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FilesModule } from 'src/files/files.module';
import { PrivateFilesModule } from 'src/files/privateFiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address]),
    FilesModule,
    PrivateFilesModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
