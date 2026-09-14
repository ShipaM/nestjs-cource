import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller.js';

@Module({
  controllers: [TopPageController]
})
export class TopPageModule {}
