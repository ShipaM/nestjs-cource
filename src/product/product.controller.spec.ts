import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller.js';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // The product feature is not implemented yet: every route handler is a
  // no-op stub. These tests document that current behaviour so a future
  // implementation change is a deliberate, visible diff rather than a silent
  // regression.
  it('create resolves without a value', async () => {
    await expect(
      controller.create({
        image: 'image.png',
        title: 'Title',
        description: 'Description',
        price: 100,
        oldPrice: 0,
        credit: 0,
        calculatedRating: 0,
        ratingCount: 0,
        advantages: '',
        disadvantages: '',
        categories: [],
        tags: '',
        characteristics: [],
      } as any),
    ).resolves.toBeUndefined();
  });

  it('getProductById resolves without a value', async () => {
    await expect(controller.getProductById('id')).resolves.toBeUndefined();
  });

  it('delete resolves without a value', async () => {
    await expect(controller.delete('id')).resolves.toBeUndefined();
  });

  it('update resolves without a value', async () => {
    await expect(
      controller.update('id', {} as any),
    ).resolves.toBeUndefined();
  });

  it('find resolves without a value', async () => {
    await expect(
      controller.find({ limit: 10, category: 'test' }),
    ).resolves.toBeUndefined();
  });
});
