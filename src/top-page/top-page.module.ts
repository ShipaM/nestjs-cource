import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageModel, TopPageSchema } from './top-page.model.js';

@Module({
  controllers: [TopPageController],
  imports: [
    MongooseModule.forFeature([{ name: TopPageModel.name, schema: TopPageSchema }]),
  ],
})
export class TopPageModule {}
