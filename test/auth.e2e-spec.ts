import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { App } from 'supertest/types.js';
import { disconnect } from 'mongoose';

const testDto = {
  email: 'test@test.com',
  password: 'password',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testDto)
      .expect(201);

    expect(body.message).toBe('Registration');
  });

  it('/auth/login (POST)', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testDto)
      .expect(200);

    expect(body.message).toBe('Login');
  });

  afterAll(async () => {
    disconnect();
  });
});
