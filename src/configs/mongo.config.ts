import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

const getMongoString = (configService: ConfigService) => {
  return `mongodb://${configService.get<string>('MONGO_LOGIN')}:${configService.get<string>('MONGO_PASSWORD')}@${configService.get<string>('MONGO_HOST')}:${configService.get<string>('MONGO_PORT')}/${configService.get<string>('MONGO_AUTHDATABASE')}`;
};

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: getMongoString(configService),
  };
};
