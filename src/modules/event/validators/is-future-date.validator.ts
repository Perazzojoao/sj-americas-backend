import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    const inputDate = new Date(date);
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Ignora horas, minutos e segundos no UTC
    return inputDate >= currentDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Date must be in the future';
  }
}
