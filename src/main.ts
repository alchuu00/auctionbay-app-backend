import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';

import { AppModule } from './modules/app.module';
import Logging from './library/Logging';
import { AllExceptionsFilter } from './helpers/GlobalExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  // Enable CORS for the frontend to access the API
  app.enableCors({
    origin: [
      'https://auctionbay.netlify.app',
      'https://master--auctionbay.netlify.app',
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  // Setup to serve static files
  app.use('/files', express.static('files'));

  // Setup global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('AuctionBay API - Online Auction Platform')
    .setDescription(
      'This is the API for the AuctionBay application. The application provides a platform for online auctions, allowing users to bid on various items.',
    )
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  // Start the backend server
  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);

  Logging.info(`App is listening on: ${await app.getUrl()}`);
}
bootstrap();
