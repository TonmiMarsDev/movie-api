import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Crea película' })
  @Roles('admin')
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sincroniza películas desde SWAPI' })
  @Roles('admin')
  async syncMovies() {
    return this.moviesService.syncWithSwapi();
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de películas desde MongoDB' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener película por ID de MongoDB' })
  @Roles('regular', 'admin')
  getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza película por su ID' })
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina película por su ID' })
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
