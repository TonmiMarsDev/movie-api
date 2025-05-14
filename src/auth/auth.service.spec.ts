import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schemas/user.schema'; // Importa el tipo UserDocument

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser: Partial<UserDocument> = {
    _id: 'user123',
    name: 'Misael',
    email: 'misael@example.com',
    password: 'hashedPassword',
    role: 'user',
    $set: jest.fn(),
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('debería validar credenciales correctas', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('misael@example.com', 'password');
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar error si el usuario no existe', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(service.validateUser('wrong@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.validateUser('misael@example.com', 'wrongpass')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('debería retornar access_token y datos del usuario', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as UserDocument);

      const result = await service.login('misael@example.com', 'password');

      expect(result).toEqual({
        access_token: 'mocked-jwt-token',
        user: {
          id: 'user123',
          name: 'Misael',
          email: 'misael@example.com',
          role: 'user',
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user123',
        email: 'misael@example.com',
        role: 'user',
      });
    });
  });
});
