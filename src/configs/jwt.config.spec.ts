import { getJwtConfig } from './jwt.config.js';

describe('getJwtConfig', () => {
  it('builds jwt module options using the JWT_SECRET from config', async () => {
    const configService = {
      get: vi.fn().mockReturnValue('test-secret'),
    } as any;

    const result = await getJwtConfig(configService);

    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    expect(result).toEqual({
      secret: 'test-secret',
      signOptions: { expiresIn: '1h' },
    });
  });
});
