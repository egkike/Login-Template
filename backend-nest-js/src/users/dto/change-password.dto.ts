import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Este DTO se utiliza para validar la entrada de datos al cambiar la contraseña de un usuario
// Asegúrate de que la contraseña cumpla con los requisitos mínimos
// como longitud y no esté vacía
export class ChangePasswordDto {
  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'NewPass123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password too short' })
  password: string;
}
