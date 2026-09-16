import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  const testDto = {
    email: 'test@test.com',
    password: 'password',
  };

  const authService = {
    createUser: vi.fn(),
    validateUser: vi.fn(),
    login: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('delegates to authService.createUser', async () => {
      const createdUser = { _id: 'user-id', email: testDto.email };
      authService.createUser.mockResolvedValueOnce(createdUser);

      const result = await controller.register(testDto);

      expect(authService.createUser).toHaveBeenCalledWith(testDto);
      expect(result).toBe(createdUser);
    });
  });

  describe('login', () => {
    it('validates the user then logs them in', async () => {
      authService.validateUser.mockResolvedValueOnce({ email: testDto.email });
      const tokenResponse = { access_token: 'signed-jwt' };
      authService.login.mockResolvedValueOnce(tokenResponse);

      const result = await controller.login(testDto);

      expect(authService.validateUser).toHaveBeenCalledWith(testDto);
      expect(authService.login).toHaveBeenCalledWith(testDto.email);
      expect(result).toBe(tokenResponse);
    });
  });
});
