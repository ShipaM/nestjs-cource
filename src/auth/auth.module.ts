import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModel, AuthSchema } from './auth.model.js';

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: AuthModel.name, schema: AuthSchema }]),
  ],
})
export class AuthModule {}
