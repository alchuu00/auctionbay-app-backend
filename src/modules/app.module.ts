import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from 'src/config/schema.config';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { AuctionItemsModule } from './auctionItems/auctionItems.module';
import { AuthModule } from './auth/auth.module';
import { BidsModule } from './bids/bids.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // which .env file it reads
      envFilePath: [`vars/.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AuctionItemsModule,
    BidsModule,
    TokenModule,
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  // Logger for console.log routes and urls
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
