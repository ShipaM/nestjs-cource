import 'reflect-metadata';
import type { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { UserEmail } from './user-email.decorator.js';

// NestJS custom param decorators created with `createParamDecorator` are not
// directly callable outside of a request context, so the factory function has
// to be extracted from the route args metadata to be unit tested.
const getParamDecoratorFactory = (decorator: Function) => {
  class TestDecoratorHost {
    public test(@(decorator() as any) _value: unknown) {}
  }

  const args = Reflect.getMetadata(
    ROUTE_ARGS_METADATA,
    TestDecoratorHost,
    'test',
  );

  return Object.values(args)[0] as { factory: (data: unknown, ctx: ExecutionContext) => unknown };
};

const buildContext = (user?: { email: string }): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

describe('UserEmail decorator', () => {
  it('extracts the email from the authenticated user on the request', () => {
    const { factory } = getParamDecoratorFactory(UserEmail);

    const result = factory(undefined, buildContext({ email: 'test@test.com' }));

    expect(result).toBe('test@test.com');
  });

  it('returns undefined when the request has no authenticated user', () => {
    const { factory } = getParamDecoratorFactory(UserEmail);

    const result = factory(undefined, buildContext(undefined));

    expect(result).toBeUndefined();
  });
});
