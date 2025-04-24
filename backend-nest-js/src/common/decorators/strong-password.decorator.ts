import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import validator from 'validator';

// Este decorador se utiliza para validar que una contraseña sea fuerte
// Se considera que una contraseña es fuerte si tiene al menos 6 caracteres,
// 1 letra minúscula, 1 letra mayúscula y 1 número
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
          });
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number';
        },
      },
    });
  };
}
