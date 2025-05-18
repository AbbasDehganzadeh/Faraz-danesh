import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_AUTH_SECRET'),
      passReqToCallback: true,
    });
  }
  validate(req: Request, token: JwtPayload) {
    console.log('TokenType:  %T', token);
    const rt = req?.get('authorization')?.replace('Bearer', '').trim();
    return {
      username: token.username,
      id: Number(token.sub),
      role: token.role,
      refreshToken: rt,
    };
  }
}
