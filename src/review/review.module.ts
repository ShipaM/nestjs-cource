import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModel, ReviewSchema } from './review.model.js';
import { ReviewService } from './review.service.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ReviewController],
  imports: [
    MongooseModule.forFeature([{ name: ReviewModel.name, schema: ReviewSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [ReviewService],
})
export class ReviewModule {}
