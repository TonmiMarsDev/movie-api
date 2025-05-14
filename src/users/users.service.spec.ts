import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserDoc = {
  _id: 'userId',
  name: 'Misael',
  email: 'misael.dev@example.com',
  password: 'hashedpass',
  role: 'regular',
};

const createUserDto = {
  name: 'Misael',
  email: 'misael.dev@example.com',
  password: '123456',
  role: 'regular',
};
class MockUserModel {
  save: jest.Mock;

  constructor(data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(mockUserDoc); // <--- aquí ya se simula save
  }

  static find = jest.fn();
  static findById = jest.fn();
  static findByIdAndUpdate = jest.fn();
  static findByIdAndDelete = jest.fn();
  static findOne = jest.fn();
}

describe('UsersService', () => {
  let service: UsersService;
  let model: typeof MockUserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get(getModelToken(User.name));
  });

  describe('create', () => {
    it('should hash the password and save a user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
      expect(result).toEqual(mockUserDoc);
    });

    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpass');

      const conflictInstance = new MockUserModel(createUserDto);
      conflictInstance.save = jest.fn().mockRejectedValue({ code: 11000 });

      jest
        .spyOn(service as any, 'userModel')
        .mockImplementation(() => conflictInstance);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });
  describe('findAll', () => {
    it('should return all users', async () => {
      const execMock = jest.fn().mockResolvedValue([mockUserDoc]);
      MockUserModel.find.mockReturnValue({ exec: execMock });

      const result = await service.findAll();
      expect(result).toEqual([mockUserDoc]);
    });
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUserDoc);
      MockUserModel.findById.mockReturnValue({ exec: execMock });

      const result = await service.findOne('userId');
      expect(result).toEqual(mockUserDoc);
    });

    it('should throw NotFoundException if not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      MockUserModel.findById.mockReturnValue({ exec: execMock });

      await expect(service.findOne('userId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user and return it', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUserDoc);
      MockUserModel.findByIdAndUpdate.mockReturnValue({ exec: execMock });

      const result = await service.update('userId', { name: 'New Name' });
      expect(result).toEqual(mockUserDoc);
    });

    it('should throw NotFoundException if user not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      MockUserModel.findByIdAndUpdate.mockReturnValue({ exec: execMock });

      await expect(service.update('userId', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const execMock = jest.fn().mockResolvedValue(mockUserDoc);
      MockUserModel.findByIdAndDelete.mockReturnValue({ exec: execMock });

      await expect(service.remove('userId')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      MockUserModel.findByIdAndDelete.mockReturnValue({ exec: execMock });

      await expect(service.remove('userId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      MockUserModel.findOne.mockResolvedValue(mockUserDoc);
      const result = await service.findByEmail('john@example.com');
      expect(result).toEqual(mockUserDoc);
    });
  });
});
