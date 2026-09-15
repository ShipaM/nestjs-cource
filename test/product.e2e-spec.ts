import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { App } from 'supertest/types.js';
import { Types, disconnect } from 'mongoose';

const productId = new Types.ObjectId().toString();

const testDto = {
  image: 'image.png',
  title: 'Test title',
  description: 'Test description',
  price: 100,
  credit: 10,
  advantages: 'Test advantages',
  disadvantages: 'Test disadvantages',
  categories: ['test'],
  tags: 'test',
  characteristics: [{ name: 'name', value: 'value' }],
};

describe('ProductController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/product/create (POST)', async () => {
    await request(app.getHttpServer())
      .post('/product/create')
      .send(testDto)
      .expect(201);
  });

  it('/product/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/product/${productId}`)
      .expect(200);
  });

  it('/product/:id (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch(`/product/${productId}`)
      .send(testDto)
      .expect(200);
  });

  it('/product/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/product/${productId}`)
      .expect(200);
  });

  it('/product (POST) - find', async () => {
    await request(app.getHttpServer())
      .post('/product')
      .send({ limit: 10, category: 'test' })
      .expect(200);
  });

  afterAll(async () => {
    disconnect();
  });
});
