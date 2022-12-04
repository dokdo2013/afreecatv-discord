import { RedisModule } from '@nestjs-modules/ioredis';
import { HttpException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiOutputInterceptor } from './common/api-response.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { BroadcastModule } from './broadcast/broadcast.module';
import { CronModule } from './cron/cron.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      timezone: 'Asia/Seoul',
    }),
    RedisModule.forRoot({
      config: {
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      },
    }),
    ScheduleModule.forRoot(),
    BroadcastModule,
    CronModule,
    AuthModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiOutputInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useValue: new RavenInterceptor({
    //     filters: [
    //       {
    //         type: HttpException,
    //         filter: (exception: HttpException) => 400 > exception.getStatus(),
    //       },
    //     ],
    //   }),
    // },
  ],
})
export class AppModule {}
