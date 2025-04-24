import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Este decorador se utiliza para validar los datos de entrada en la creación de un usuario
// y para documentar la API utilizando Swagger.
// Se utiliza en el controlador de usuarios para validar los datos de entrada
// y generar la documentación de la API.
export class CreateUserDto {
  @ApiProperty({ description: 'Username', example: 'testuser' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'Username too short' })
  username: string;

  @ApiProperty({ description: 'Email', example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Full name', example: 'Test User' })
  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'Fullname too short' })
  fullname?: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'Test123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password too short' })
  password: string;

  @ApiPropertyOptional({ description: 'User level', example: 1 })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Level must be at least 0' })
  level?: number;

  @ApiPropertyOptional({ description: 'Active status (0 or 1)', example: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Active must be at least 0' })
  @Max(1, { message: 'Active must be at most 1' })
  active?: number;
}
