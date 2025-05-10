import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_AUTH_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
    GithubStrategy,
    // { provide: APP_GUARD, useClass: RolesGuard }, //? It shoudn't be commented
  ],
  exports: [AuthService, JwtModule, JwtStrategy], //! remove it after authorization test;
})
export class AuthModule {}
