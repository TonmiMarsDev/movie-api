import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';

const mockMovie = {
  _id: '6641b7f5bcf86cd799439011',
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl: 'It is a period of civil war...',
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1977-05-25',
};

const mockMovieModel = {
  new: jest.fn().mockResolvedValue(mockMovie),
  constructor: jest.fn().mockResolvedValue(mockMovie),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  insertMany: jest.fn(),
  countDocuments: jest.fn(),
  deleteMany: jest.fn(),
  save: jest.fn(),
};

describe('MoviesService', () => {
  let service: MoviesService;
  let model: Model<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://swapi.dev/api/films/'),
          },
        },
        {
          provide: getModelToken(Movie.name),
          useValue: {
            ...mockMovieModel,
            new: jest.fn().mockImplementation((dto) => ({
              save: jest.fn().mockResolvedValue({ _id: 'mock-id', ...dto }),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    model = module.get<Model<Movie>>(getModelToken(Movie.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const saveMock = jest.fn().mockResolvedValue(mockMovie);
      const modelMock = jest.fn().mockImplementation(() => ({
        save: saveMock,
      }));
  
      // Sobrescribimos el modelo con el mock
      (service as any).movieModel = modelMock;
  
      const result = await service.create(mockMovie);
  
      expect(modelMock).toHaveBeenCalledWith(mockMovie);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockMovie);
    });
  });

  describe('findAll', () => {
    it('should return movies from the database if not empty', async () => {
      (model.countDocuments as jest.Mock).mockResolvedValue(1);
      (model.find as jest.Mock).mockResolvedValue([mockMovie]);

      const result = await service.findAll();
      expect(result).toEqual([mockMovie]);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      (model.findById as jest.Mock).mockResolvedValue(mockMovie);

      const result = await service.getMovieById(mockMovie._id);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      (model.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getMovieById('6641b7f5bcf86cd799439099')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for invalid ObjectId', async () => {
      await expect(service.getMovieById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a movie and return the updated document', async () => {
      const updatedMovie = { ...mockMovie, title: 'Updated Title' };
      (model.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedMovie);

      const result = await service.update(mockMovie._id, { title: 'Updated Title' } as any);
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException if movie not found during update', async () => {
      (model.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(service.update(mockMovie._id, { title: 'x' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a movie', async () => {
      (model.findByIdAndDelete as jest.Mock).mockResolvedValue(mockMovie);

      const result = await service.remove(mockMovie._id);
      expect(result.message).toBe('Película eliminada correctamente');
    });

    it('should throw NotFoundException if movie not found during delete', async () => {
      (model.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(mockMovie._id)).rejects.toThrow(NotFoundException);
    });
  });
});
