import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, AuthSchema } from './user.model.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../configs/jwt.config.js';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: AuthSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
