import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';

export const GetUsername = createParamDecorator(
  (data: any, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.username!;
  },
);
