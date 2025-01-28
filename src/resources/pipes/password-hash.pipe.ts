import { Injectable, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  constructor() {}
  async transform(passord: string) {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(passord, salt);
  }
}