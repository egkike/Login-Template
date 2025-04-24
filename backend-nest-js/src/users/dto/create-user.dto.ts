import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { IsStrongPassword } from '../../common/decorators/strong-password.decorator';

// Esta clase se utiliza para validar los datos de entrada al crear un nuevo usuario
// en la base de datos. Utiliza decoradores de class-validator para asegurar
// que los datos cumplen con ciertos criterios antes de ser procesados.
export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(4, { message: 'Username too short' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password too short' })
  @IsStrongPassword()
  password: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'Fullname too short' })
  fullname?: string;
}
