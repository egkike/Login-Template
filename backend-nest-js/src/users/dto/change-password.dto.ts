import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { IsStrongPassword } from '../../common/decorators/strong-password.decorator';

// Este decorador se utiliza para validar que la contraseña cumpla con los requisitos de seguridad
// como longitud mínima, uso de mayúsculas, minúsculas, números y caracteres especiales.
// La validación se realiza en el decorador IsStrongPassword, que se encuentra en el archivo strong-password.decorator.ts
// El decorador IsStrongPassword se encarga de verificar que la contraseña cumpla con los requisitos de seguridad
// y lanza un error si no lo hace.
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password too short' })
  @IsStrongPassword()
  password: string;
}
