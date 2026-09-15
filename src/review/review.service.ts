import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReviewDocument, ReviewModel } from './review.model.js';
import { CreateReviewDto } from './dto/create-review-dto.js';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewDocument> {
    return this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<ReviewDocument | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async findByProductId(productId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ productId: this.toObjectId(productId) })
      .exec();
  }

  async deleteByProductId(
    productId: string,
  ): Promise<{ deletedCount: number }> {
    const { deletedCount } = await this.reviewModel
      .deleteMany({ productId: this.toObjectId(productId) })
      .exec();
    return { deletedCount };
  }

  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }
    return new Types.ObjectId(id);
  }
}
