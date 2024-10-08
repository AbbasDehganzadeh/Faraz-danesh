import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import config from './common/config';
import { User } from './auth/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule } from './content/content.module';
import { RedisModule } from './redisdb/redis.module';
import * as morgan from 'morgan';
import * as cors from 'cors';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../dev.env',
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3', //NOTE: use postgres later!
      database: './auth.sql',
      entities: [User], //! it should be `__dirname + '/../**/*.entity.{js,ts}'`
      synchronize: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/elearning'),
    AuthModule,
    ContentModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('combined'), cors({ origin: '*' })).forRoutes('*');
  }
}
