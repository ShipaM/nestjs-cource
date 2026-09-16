import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

export const UserEmail = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    return request.user?.email;
  },
);
