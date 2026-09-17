import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { AuthService } from './auth.service.js';
import { UserModel } from './user.model.js';
import {
  ALREADY_REGISTERED_ERROR,
  INCORRECT_PASSWORD_ERROR,
  USER_NOT_FOUND_ERROR,
} from './auth.constants.js';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: { signAsync: ReturnType<typeof vi.fn> };

  const dto = { email: 'test@test.com', password: 'password' };

  beforeEach(async () => {
    // The mongoose model is invoked as `new this.userModel(...)` when
    // creating a user, so the mock has to be a constructable function.
    userModel = vi.fn().mockImplementation(function (
      this: any,
      data: Record<string, unknown>,
    ) {
      Object.assign(this, data);
      this._id = new Types.ObjectId();
      this.save = vi.fn().mockResolvedValue(undefined);
    });
    userModel.findOne = vi.fn();
    jwtService = {
      signAsync: vi.fn().mockResolvedValue('signed-jwt'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(UserModel.name), useValue: userModel },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('throws when the email is already registered', async () => {
      userModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ email: dto.email }),
      });

      await expect(service.createUser(dto)).rejects.toThrow(
        new BadRequestException(ALREADY_REGISTERED_ERROR),
      );
    });

    it('creates and returns a new user when the email is not registered', async () => {
      userModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      const result = await service.createUser(dto);

      expect(userModel).toHaveBeenCalledTimes(1);
      expect(result._id).toBeDefined();
      expect(result.email).toBe(dto.email);
      expect((result as Record<string, unknown>).passwordHash).toBeUndefined();
    });
  });

  describe('validateUser', () => {
    it('throws when the user does not exist', async () => {
      userModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.validateUser(dto)).rejects.toThrow(
        new UnauthorizedException(USER_NOT_FOUND_ERROR),
      );
    });

    it('throws when the password is incorrect', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 10);
      userModel.findOne.mockReturnValue({
        exec: vi
          .fn()
          .mockResolvedValue({ email: dto.email, passwordHash }),
      });

      await expect(service.validateUser(dto)).rejects.toThrow(
        new UnauthorizedException(INCORRECT_PASSWORD_ERROR),
      );
    });

    it('returns the email when credentials are valid', async () => {
      const passwordHash = await bcrypt.hash(dto.password, 10);
      userModel.findOne.mockReturnValue({
        exec: vi
          .fn()
          .mockResolvedValue({ email: dto.email, passwordHash }),
      });

      await expect(service.validateUser(dto)).resolves.toEqual({
        email: dto.email,
      });
    });
  });

  describe('login', () => {
    it('returns a signed access token', async () => {
      await expect(service.login(dto.email)).resolves.toEqual({
        access_token: 'signed-jwt',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ email: dto.email });
    });
  });
});
