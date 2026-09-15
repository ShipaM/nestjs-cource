import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { App } from 'supertest/types.js';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants.js';

const productId = new Types.ObjectId().toString();

const testDto = {
  name: 'Test',
  title: 'Test title',
  description: 'Test description',
  rating: 5,
  productId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  let createReviewId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('/review/create (POST) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201);

    createReviewId = body._id;
    expect(createReviewId).toBeDefined();
  });

  it('/review/create (POST) - fail', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400);

    expect(body.message).toBeDefined();
  });

  it('/review/by-product/:productId (GET) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/review/by-product/${productId}`)
      .expect(200);

    expect(body.length).toBeGreaterThan(0);
  });

  it('/review/by-product/:productId (GET) - fail', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .get(`/review/by-product/${new Types.ObjectId().toString()}`)
      .expect(200);

    expect(body.length).toBe(0);
  });

  it('/review/:id (DELETE) - success', async () => {
    await request(app.getHttpServer())
      .delete(`/review/${createReviewId}`)
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', async () => {
    await request(app.getHttpServer())
      .delete(`/review/${createReviewId}`)
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND });
  });

  it('/review/by-product/:productId (DELETE) - success', async () => {
    const productIdToDelete = new Types.ObjectId().toString();

    await request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, productId: productIdToDelete })
      .expect(201);

    const { body }: request.Response = await request(app.getHttpServer())
      .delete(`/review/by-product/${productIdToDelete}`)
      .expect(200);

    expect(body.deletedCount).toBe(1);
  });

  it('/review/by-product/:productId (DELETE) - no reviews', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .delete(`/review/by-product/${new Types.ObjectId().toString()}`)
      .expect(200);

    expect(body.deletedCount).toBe(0);
  });

  afterAll(async () => {
    disconnect();
  });
});
