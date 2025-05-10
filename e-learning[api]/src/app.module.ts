import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule } from './content/content.module';
import { RedisModule } from './redisdb/redis.module';
import * as morgan from 'morgan';
import * as cors from 'cors';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configservice: ConfigService) => {
        switch (process.env.environment) {
          case 'test':
            return {
              type: 'sqlite',
              database: ':memory:',
              entities: [User], //! it should be `__dirname + '/../**/*.entity.{js,ts}'`
              synchronize: true,
            };
          //NOTE: use postgres in production mode!
          case 'prod':
            return {
              type: 'postgres',
              port: configservice.get<number>('DB_PSQL_PORT'),
              host: configservice.get<string>('DB_PSQL_HOST'),
              username: configservice.get<string>('DB_PSQL_USER'),
              password: configservice.get<string>('DB_PSQL_PASS'),
              entities: [User], //! it should be `__dirname + '/../**/*.entity.{js,ts}'`
              synchronize: true,
            };
          default: // dev
            return {
              type: 'better-sqlite3', //NOTE: use postgres later!
              database: './auth.sql',
              entities: [User], //! it should be `__dirname + '/../**/*.entity.{js,ts}'`
              synchronize: true,
            };
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configservice: ConfigService) => ({
        uri: configservice.get<string>('DB_MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
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
