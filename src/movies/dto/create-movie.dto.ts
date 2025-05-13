import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    example: 'A New Hope',
    description: 'Título de la película',
  })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  title: string;

  @ApiProperty({
    example: 4,
    description: 'ID del episodio',
  })
  @IsNumber({}, { message: 'El episode_id debe ser un número' })
  episode_id: number;

  @ApiProperty({
    example: 'It is a period of civil war...',
    description: 'Texto de apertura de la película',
  })
  @IsString({ message: 'El opening_crawl debe ser una cadena de texto' })
  opening_crawl: string;

  @ApiProperty({
    example: 'George Lucas',
    description: 'Director de la película',
  })
  @IsString({ message: 'El director debe ser una cadena de texto' })
  director: string;

  @ApiProperty({
    example: 'Gary Kurtz, Rick McCallum',
    description: 'Productores de la película',
  })
  @IsString({ message: 'El producer debe ser una cadena de texto' })
  producer: string;

  @ApiProperty({
    example: '1977-05-25',
    description: 'Fecha de estreno de la película (formato ISO)',
  })
  @IsDateString({}, { message: 'La fecha de estreno debe tener formato de fecha válida (ISO 8601)' })
  release_date: string;
}
