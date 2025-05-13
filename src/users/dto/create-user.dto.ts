import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({
    example: 'misael.martinez@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  email: string;

  @ApiProperty({
    example: 'MiC0ntra$eña',
    description: 'Contraseña segura del usuario (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(32, { message: 'La contraseña no debe exceder 32 caracteres' })
  password: string;

  @ApiProperty({
    example: 'Misael',
    description: 'Nombre del usuario',
  })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @ApiProperty({
    example: 'regular',
    description: 'Tipo de usuario: "regular" o "admin"',
  })
  @IsString()
  @Matches(/^(regular|admin)$/, {
    message: 'El rol debe ser "regular" o "admin"',
  })
  role: string;
}
