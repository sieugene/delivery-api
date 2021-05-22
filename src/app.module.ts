import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './config/config.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { PrivateFilesModule } from './files/privateFiles.module';
import { SearchModule } from './search/search.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { CommentModule } from './comment/comment.module';
import { ExtraProductsModule } from './extra-products/extra-products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailSchedulingModule } from './email-scheduling/email-scheduling.module';
import { ChatModule } from './chat/chat.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: Boolean(configService.get('GRAPHQL_PLAYGROUND')),
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => ({
        ...new TypeOrmConfigService(configService).getTypeOrmConfig(),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    UsersModule,
    AuthenticationModule,
    CategoriesModule,
    FilesModule,
    PrivateFilesModule,
    SearchModule,
    SubscribersModule,
    CommentModule,
    ExtraProductsModule,
    ProductCategoriesModule,
    EmailModule,
    EmailSchedulingModule,
    ChatModule,
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
