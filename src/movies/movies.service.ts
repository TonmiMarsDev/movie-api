import { Injectable, NotFoundException  } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import axios from 'axios';
import { Agent } from 'https';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';
import { Types } from 'mongoose';

@Injectable()
export class MoviesService {
  private readonly swapiUrl: string;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {
    this.swapiUrl = this.config.get<string>('SWAPI_FILMS_URL');
  }

  async create(createMovieDto: CreateMovieDto) {
    const newMovie = new this.movieModel(createMovieDto);
    return await newMovie.save();
  }

  async findAll() {
    const count = await this.movieModel.countDocuments();
    if (count === 0) {
      const agent = new Agent({ rejectUnauthorized: false });
      const response = await axios.get(this.swapiUrl, { httpsAgent: agent });
  
      const movies = response.data.results;
  
      await this.movieModel.insertMany(movies.map(movie => ({
        title: movie.title,
        episode_id: movie.episode_id,
        opening_crawl: movie.opening_crawl,
        director: movie.director,
        producer: movie.producer,
        release_date: movie.release_date,
      })));
    }
  
    return this.movieModel.find();
  }

  async getMovieById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`ID ${id} no es válido`);
    }
  
    const movie = await this.movieModel.findById(id);
  
    if (!movie) {
      throw new NotFoundException(`Película con id ${id} no encontrada`);
    }
  
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const updated = await this.movieModel.findByIdAndUpdate(id, updateMovieDto, {
      new: true,
    });
  
    if (!updated) {
      throw new NotFoundException(`Película con id ${id} no encontrada`);
    }
  
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.movieModel.findByIdAndDelete(id);
  
    if (!deleted) {
      throw new NotFoundException(`Película con id ${id} no encontrada`);
    }
  
    return { message: 'Película eliminada correctamente' };
  }
}
