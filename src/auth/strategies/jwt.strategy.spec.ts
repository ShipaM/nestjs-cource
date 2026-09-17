import { JwtStrategy } from './jwt.strategy.js';

describe('JwtStrategy', () => {
  const buildConfigService = (secret: string | undefined) => ({
    getOrThrow: vi.fn((key: string) => {
      if (key === 'JWT_SECRET' && secret !== undefined) {
        return secret;
      }
      throw new Error(`Config key "${key}" is not set`);
    }),
  });

  it('reads JWT_SECRET from the config service on construction', () => {
    const configService = buildConfigService('test-secret');

    new JwtStrategy(configService as any);

    expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('throws when JWT_SECRET is not configured', () => {
    const configService = buildConfigService(undefined);

    expect(() => new JwtStrategy(configService as any)).toThrow();
  });

  describe('validate', () => {
    it('returns the email extracted from the jwt payload', async () => {
      const configService = buildConfigService('test-secret');
      const strategy = new JwtStrategy(configService as any);

      const result = await strategy.validate({ email: 'test@test.com' });

      expect(result).toEqual({ email: 'test@test.com' });
    });
  });
});
