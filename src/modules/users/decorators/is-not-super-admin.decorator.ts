import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator';
import { $Enums } from '@prisma/client';

@ValidatorConstraint({ name: 'isNotSuperAdmin', async: false })
export class IsNotSuperAdminValidator {
  validate(value: $Enums.Role, args: ValidationArguments) {
    return value !== $Enums.Role.SUPER_ADMIN;
  }

  defaultMessage(args: ValidationArguments) {
    return 'It is not allowed to set the role as SUPER_ADMIN';
  }
}

export function IsNotSuperAdmin(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNotSuperAdmin',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNotSuperAdminValidator,
    });
  };
}
