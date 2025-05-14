import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      login: jest.fn().mockResolvedValue({
        access_token: 'test-token',
        user: {
          id: 'user123',
          name: 'Misael',
          email: 'misael@example.com',
          role: 'user',
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debería retornar access_token al hacer login', async () => {
    const loginDto = {
      email: 'misael@example.com',
      password: 'MiC0ntra$eña',
    };

    const result = await controller.login(loginDto);

    expect(result).toEqual({
      access_token: 'test-token',
      user: {
        id: 'user123',
        name: 'Misael',
        email: 'misael@example.com',
        role: 'user',
      },
    });

    expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
  });
});
