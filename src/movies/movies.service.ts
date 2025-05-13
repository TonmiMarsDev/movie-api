import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import axios from 'axios';
import { Agent } from 'https';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MoviesService {
  private readonly swapiUrl: string;

  constructor(private readonly config: ConfigService) {
    this.swapiUrl = this.config.get<string>('SWAPI_FILMS_URL');
  }

  create(createMovieDto: CreateMovieDto) {
    return 'This action adds a new movie';
  }

  async findAll() {
    try {
      const agent = new Agent({ rejectUnauthorized: false });
      const response = await axios.get(this.swapiUrl, { httpsAgent: agent });

      return response.data.results;
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener películas de SWAPI');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
