import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCustomIntEach', async: false })
export class IsCustomIntEachValidator implements ValidatorConstraintInterface {
  validate(value: number[], args: ValidationArguments) {
    const isArray = Array.isArray(value) 
    if (!isArray) {
      return false;
    }

    if (value.length === 0) {
      return false;
    }

    return value.every((val: number) => Number.isInteger(val) && !isNaN(val) && val >= 0);
  }
}

export function IsCustomIntEach(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCustomIntEach',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsCustomIntEachValidator,
    });
  };
}
