import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { App } from 'supertest/types.js';
import { Types, disconnect } from 'mongoose';
import { TopLevelCategory } from '../src/top-page/top-page.model.js';

const topPageId = new Types.ObjectId().toString();

const testDto = {
  firstCategory: TopLevelCategory.Courses,
  secondCategory: 'Test second category',
  alias: 'test-alias',
  title: 'Test title',
  category: 'Test category',
  advantages: [],
  seoText: 'Test seo text',
  tagsTitle: 'Test tags title',
  tags: ['test'],
};

describe('TopPageController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/top-page/create (POST)', async () => {
    await request(app.getHttpServer())
      .post('/top-page/create')
      .send(testDto)
      .expect(201);
  });

  it('/top-page/:id (GET)', async () => {
    await request(app.getHttpServer())
      .get(`/top-page/${topPageId}`)
      .expect(200);
  });

  it('/top-page/:id (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch(`/top-page/${topPageId}`)
      .send(testDto)
      .expect(200);
  });

  it('/top-page/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/top-page/${topPageId}`)
      .expect(200);
  });

  it('/top-page (POST) - find', async () => {
    await request(app.getHttpServer())
      .post('/top-page')
      .send({ firstCategory: TopLevelCategory.Courses })
      .expect(200);
  });

  afterAll(async () => {
    disconnect();
  });
});
