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
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // which .env file it reads
      envFilePath: [`.env.production`],
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AuctionItemsModule,
    BidsModule,
    TokenModule,
    NotificationsModule,
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  // logger middleware for console logging all requests to the server
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
