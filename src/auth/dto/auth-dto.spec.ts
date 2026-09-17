import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthDto } from './auth-dto.js';

describe('AuthDto', () => {
  it('passes validation with a valid email and password', async () => {
    const dto = plainToInstance(AuthDto, {
      email: 'test@test.com',
      password: 'password',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('fails when the email is not a valid email address', async () => {
    const dto = plainToInstance(AuthDto, {
      email: 'not-an-email',
      password: 'password',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'email')).toBe(true);
  });

  it('fails when the password is shorter than 6 characters', async () => {
    const dto = plainToInstance(AuthDto, {
      email: 'test@test.com',
      password: '123',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'password')).toBe(true);
  });

  it('fails when required fields are missing', async () => {
    const dto = plainToInstance(AuthDto, {});

    const errors = await validate(dto);

    expect(errors.map((error) => error.property).sort()).toEqual([
      'email',
      'password',
    ]);
  });
});
