import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

function map(key: number) {
  const Roles = new Map([
    [0, 'Student'],
    [1, 'Teacher'],
    [2, 'Supervisor'],
  ]);
  return Roles.get(key);
}

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler,
      context.getClass,
    ]);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const role = map(request?.user?.role);
    return roles.some((v: any) => v === role);
  }
  //TODO private hasRole
}
