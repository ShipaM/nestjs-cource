import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReviewController } from './review.controller.js';
import { ReviewService } from './review.service.js';
import { REVIEW_NOT_FOUND } from './review.constants.js';
import { JwtAuthGuard } from '../auth/guards/jwt.guard.js';

describe('ReviewController', () => {
  let controller: ReviewController;

  const reviewService = {
    create: vi.fn(),
    delete: vi.fn(),
    findByProductId: vi.fn(),
    deleteByProductId: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: reviewService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('delegates to reviewService.create', async () => {
      const dto = {
        name: 'Test',
        title: 'Test title',
        description: 'Test description',
        rating: 5,
        productId: new Types.ObjectId().toHexString(),
      };
      const created = { _id: new Types.ObjectId(), ...dto };
      reviewService.create.mockResolvedValueOnce(created);

      const result = await controller.create(dto);

      expect(reviewService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(created);
    });
  });

  describe('delete', () => {
    it('returns the deleted document when it exists', async () => {
      const id = new Types.ObjectId().toHexString();
      const deletedDoc = { _id: id };
      reviewService.delete.mockResolvedValueOnce(deletedDoc);

      const result = await controller.delete(id);

      expect(reviewService.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(deletedDoc);
    });

    it('throws a 404 HttpException when the document does not exist', async () => {
      const id = new Types.ObjectId().toHexString();
      reviewService.delete.mockResolvedValueOnce(null);

      await expect(controller.delete(id)).rejects.toEqual(
        new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getByProduct', () => {
    it('delegates to reviewService.findByProductId', async () => {
      const productId = new Types.ObjectId().toHexString();
      const reviews = [{ productId }];
      reviewService.findByProductId.mockResolvedValueOnce(reviews);

      const result = await controller.getByProduct(productId);

      expect(reviewService.findByProductId).toHaveBeenCalledWith(productId);
      expect(result).toBe(reviews);
    });
  });

  describe('deleteByProduct', () => {
    it('delegates to reviewService.deleteByProductId', async () => {
      const productId = new Types.ObjectId().toHexString();
      const deleteResult = { deletedCount: 2 };
      reviewService.deleteByProductId.mockResolvedValueOnce(deleteResult);

      const result = await controller.deleteByProduct(productId);

      expect(reviewService.deleteByProductId).toHaveBeenCalledWith(productId);
      expect(result).toBe(deleteResult);
    });
  });
});
