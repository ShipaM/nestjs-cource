import { getMongoConfig } from './mongo.config.js';

describe('getMongoConfig', () => {
  it('builds a mongo connection uri from the config values', async () => {
    const values: Record<string, string> = {
      MONGO_LOGIN: 'user',
      MONGO_PASSWORD: 'pass',
      MONGO_HOST: 'localhost',
      MONGO_PORT: '27017',
      MONGO_DB_NAME: 'test-db',
      MONGO_AUTH_DB: 'admin',
    };
    const configService = {
      get: vi.fn((key: string) => values[key]),
    } as any;

    const result = await getMongoConfig(configService);

    expect(result).toEqual({
      uri: 'mongodb://user:pass@localhost:27017/test-db?authSource=admin',
    });
  });
});
