import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

// Este DTO se utiliza para validar los datos de inicio de sesión
// que se envían en la solicitud de inicio de sesión.
export class LoginDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
