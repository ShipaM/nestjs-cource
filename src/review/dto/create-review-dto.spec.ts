import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Types } from 'mongoose';
import { CreateReviewDto } from './create-review-dto.js';

const validPayload = {
  name: 'Test',
  title: 'Test title',
  description: 'Test description',
  rating: 5,
  productId: new Types.ObjectId().toHexString(),
};

describe('CreateReviewDto', () => {
  it('passes validation with a valid payload', async () => {
    const dto = plainToInstance(CreateReviewDto, validPayload);

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it.each([0, 6, -1])(
    'fails when rating is out of the 1-5 range (%i)',
    async (rating) => {
      const dto = plainToInstance(CreateReviewDto, { ...validPayload, rating });

      const errors = await validate(dto);

      expect(errors.some((error) => error.property === 'rating')).toBe(true);
    },
  );

  it('fails when productId is not a valid mongo id', async () => {
    const dto = plainToInstance(CreateReviewDto, {
      ...validPayload,
      productId: 'not-a-mongo-id',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'productId')).toBe(true);
  });

  it('fails when required string fields are missing', async () => {
    const dto = plainToInstance(CreateReviewDto, {
      rating: 5,
      productId: new Types.ObjectId().toHexString(),
    });

    const errors = await validate(dto);
    const invalidProperties = errors.map((error) => error.property).sort();

    expect(invalidProperties).toEqual(['description', 'name', 'title']);
  });
});
