import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.guard.js';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });

  it('extends the passport jwt AuthGuard', () => {
    expect(JwtAuthGuard.prototype).toBeInstanceOf(AuthGuard('jwt'));
  });

  it('exposes canActivate inherited from AuthGuard', () => {
    const guard = new JwtAuthGuard();

    expect(typeof guard.canActivate).toBe('function');
  });
});
