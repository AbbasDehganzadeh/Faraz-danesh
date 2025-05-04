import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'super secret',
      passReqToCallback: true,
    });
  }
  validate(req: Request, token: JwtPayload) {
    console.log('TokenType:  %T', token);
    const rt = req?.get('authorization')?.replace('Bearer', '').trim();
    return { username: token.username, role: token.role, refreshToken: rt };
  }
}
