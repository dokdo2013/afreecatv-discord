import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { AlertModule } from './alert/alert.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { BroadcastModule } from './broadcast/broadcast.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sentry.init({
  //   dsn: process.env.SENTRY_DSN,
  //   sampleRate: 1.0,
  // });

  const config = new DocumentBuilder()
    .setTitle('AfreecaTV Discord Alert API')
    .setDescription('AfreecaTV Discord Alert API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, AlertModule, ImageModule, BroadcastModule],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(7270);
}
bootstrap();
