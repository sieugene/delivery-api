import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './config/config.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import Products from './products/products.entity';
import User from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        ...new TypeOrmConfigService(configService).getTypeOrmConfig(),
        entities: [Products, User],
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    UsersModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global exception
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionLoggerFilter,
    // },
  ],
})
export class AppModule {}
