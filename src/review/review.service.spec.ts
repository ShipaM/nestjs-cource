import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { ReviewModel } from './review.model.js';
import { Types } from 'mongoose';

describe('ReviewService', () => {
  let service: ReviewService;

  const reviewModel = {
    create: vi.fn(),
    findByIdAndDelete: vi.fn(() => ({ exec: vi.fn() })),
    find: vi.fn(() => ({ exec: vi.fn() })),
    deleteMany: vi.fn(() => ({ exec: vi.fn() })),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getModelToken(ReviewModel.name),
          useValue: reviewModel,
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a review from the given dto', async () => {
      const dto = {
        name: 'Test',
        title: 'Test title',
        description: 'Test description',
        rating: 5,
        productId: new Types.ObjectId().toHexString(),
      };
      const created = { _id: new Types.ObjectId(), ...dto };
      reviewModel.create.mockResolvedValueOnce(created);

      const result = await service.create(dto);

      expect(reviewModel.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(created);
    });
  });

  describe('delete', () => {
    it('returns the deleted document when it exists', async () => {
      const id = new Types.ObjectId().toHexString();
      const deletedDoc = { _id: id };
      const exec = vi.fn().mockResolvedValueOnce(deletedDoc);
      reviewModel.findByIdAndDelete.mockReturnValueOnce({ exec });

      const result = await service.delete(id);

      expect(reviewModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toBe(deletedDoc);
    });

    it('returns null when the document does not exist', async () => {
      const id = new Types.ObjectId().toHexString();
      const exec = vi.fn().mockResolvedValueOnce(null);
      reviewModel.findByIdAndDelete.mockReturnValueOnce({ exec });

      const result = await service.delete(id);

      expect(result).toBeNull();
    });
  });

  describe('findByProductId', () => {
    it('returns reviews matching the given productId', async () => {
      const id = new Types.ObjectId().toHexString();
      const reviews = [{ productId: id }];
      const exec = vi.fn().mockResolvedValueOnce(reviews);
      reviewModel.find.mockReturnValueOnce({ exec });

      const result = await service.findByProductId(id);

      expect(reviewModel.find).toHaveBeenCalledWith({
        productId: new Types.ObjectId(id),
      });
      expect(result).toBe(reviews);
    });

    it('throws BadRequestException for an invalid id', async () => {
      await expect(service.findByProductId('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteByProductId', () => {
    it('returns the number of deleted reviews', async () => {
      const id = new Types.ObjectId().toHexString();
      const exec = vi.fn().mockResolvedValueOnce({ deletedCount: 3 });
      reviewModel.deleteMany.mockReturnValueOnce({ exec });

      const result = await service.deleteByProductId(id);

      expect(reviewModel.deleteMany).toHaveBeenCalledWith({
        productId: new Types.ObjectId(id),
      });
      expect(result).toEqual({ deletedCount: 3 });
    });

    it('throws BadRequestException for an invalid id', async () => {
      await expect(service.deleteByProductId('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
