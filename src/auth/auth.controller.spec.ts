import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';

describe('AuthController', () => {
  let controller: AuthController;

  const testDto = {
    email: 'test@test.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('returns a registration message', async () => {
      const result = await controller.register(testDto);

      expect(result).toEqual({ message: 'Registration' });
    });
  });

  describe('login', () => {
    it('returns a login message', async () => {
      const result = await controller.login(testDto);

      expect(result).toEqual({ message: 'Login' });
    });
  });
});
