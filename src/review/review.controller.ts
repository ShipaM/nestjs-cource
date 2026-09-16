import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review-dto.js';
import { ReviewService } from './review.service.js';
import { REVIEW_NOT_FOUND } from './review.constants.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return deletedDoc;
  }

  @Get('by-product/:productId')
  async getByProduct(@Param('productId') productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('by-product/:productId')
  async deleteByProduct(@Param('productId') productId: string) {
    return this.reviewService.deleteByProductId(productId);
  }
}
