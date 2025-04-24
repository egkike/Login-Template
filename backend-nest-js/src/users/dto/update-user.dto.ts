import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MinLength,
} from 'class-validator';

// Esta clase se utiliza para validar los datos de entrada al actualizar un usuario
// en la base de datos. Se asegura de que los datos cumplan con ciertos criterios
// antes de ser procesados por el controlador y el servicio de usuarios.
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'Fullname too short' })
  fullname?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Level must be at least 0' })
  level?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Active must be at least 0' })
  @Max(1, { message: 'Active must be at most 1' })
  active?: number;
}
