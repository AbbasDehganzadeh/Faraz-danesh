import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from './roles.docorator';
import { roles } from 'src/common/enum/roles.enum';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // console.log({ refl: this.reflector });
    const roles = this.reflector.getAllAndOverride<roles[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const role = request?.user?.role;
    console.log({ role, roles });
    return roles.some((v: any) => v === role);
  }
  //TODO private hasRole
}
