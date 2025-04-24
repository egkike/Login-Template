import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Este DTO se utiliza para la autenticación de usuarios
// a través de nombre de usuario o correo electrónico y contraseña.
// Se valida que la contraseña tenga al menos 6 caracteres
// y que el nombre de usuario o correo electrónico sean cadenas opcionales.
export class LoginDto {
  @ApiPropertyOptional({
    description: 'Username for login',
    example: 'testuser',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    description: 'Email for login',
    example: 'test@example.com',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'Test123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
