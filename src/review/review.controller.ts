import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewModel } from './review.model.js';

@Controller('review')
export class ReviewController {
  @Post('create')
  asynccreate(@Body() dto: Omit<ReviewModel, 'id'>) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId') productId: string) {}
}
