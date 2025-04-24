import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Este decorador se utiliza para documentar la propiedad en la API
// y especificar que es opcional
// y proporciona un ejemplo de valor para la propiedad
// class-validator se utiliza para validar los datos de entrada
// class-transformer se utiliza para transformar los datos de entrada
export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Full name', example: 'Updated User' })
  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'Fullname too short' })
  fullname?: string;

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
