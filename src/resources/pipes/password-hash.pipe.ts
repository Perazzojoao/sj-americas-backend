import { Injectable, PipeTransform } from '@nestjs/common';
import { hashPassword } from 'src/lib/hash-password';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  constructor() {}
  async transform(passord: string) {
    return await hashPassword(passord);
  }
}
