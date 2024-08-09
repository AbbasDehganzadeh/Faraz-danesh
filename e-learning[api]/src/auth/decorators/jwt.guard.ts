import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Observable } from 'rxjs';

export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;
    console.log({header})
    const user = this.verifyToken(header);
    console.log({ user });
    if (user) {
      return true;
    }
    return false;
  }
  private verifyToken(header: string) {
    const token = header.split('')[2];
    console.log({ token });
    const res = this.jwtService.verify(token, {
      secret: 'super sectet',
      ignoreExpiration: true,
    });
    return { username: res.username, role: res.role };
  }
}
