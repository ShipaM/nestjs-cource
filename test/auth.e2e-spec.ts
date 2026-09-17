import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, disconnect } from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { App } from 'supertest/types.js';
import { UserDocument, UserModel } from '../src/auth/user.model.js';
import {
  ALREADY_REGISTERED_ERROR,
  INCORRECT_PASSWORD_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../src/auth/auth.constants.js';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let userModel: Model<UserDocument>;

  const testDto = {
    email: `test-${Date.now()}@test.com`,
    password: 'password',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    userModel = app.get(getModelToken(UserModel.name));
  });

  afterAll(async () => {
    await userModel.deleteMany({ email: testDto.email });
    await disconnect();
  });

  it('/auth/register (POST) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testDto)
      .expect(201);

    expect(body._id).toBeDefined();
    expect(body.email).toBe(testDto.email);
    expect(body.passwordHash).toBeUndefined();
  });

  it('/auth/register (POST) - fail when email is already registered', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testDto)
      .expect(400);

    expect(body.message).toBe(ALREADY_REGISTERED_ERROR);
  });

  it('/auth/register (POST) - fail on invalid email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'not-an-email', password: 'password' })
      .expect(400);
  });

  it('/auth/register (POST) - fail when password is missing', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: `missing-password-${Date.now()}@test.com` })
      .expect(400);
  });

  it('/auth/register (POST) - fail when password is too short', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: `short-password-${Date.now()}@test.com`, password: '123' })
      .expect(400);
  });

  it('/auth/login (POST) - success', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testDto)
      .expect(200);

    expect(typeof body.access_token).toBe('string');
  });

  it('/auth/login (POST) - fail on incorrect password', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...testDto, password: 'wrong-password' })
      .expect(401);

    expect(body.message).toBe(INCORRECT_PASSWORD_ERROR);
  });

  it('/auth/login (POST) - fail on unknown user', async () => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'unknown@test.com', password: 'password' })
      .expect(401);

    expect(body.message).toBe(USER_NOT_FOUND_ERROR);
  });
});
