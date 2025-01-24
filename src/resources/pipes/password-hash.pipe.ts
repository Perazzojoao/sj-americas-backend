import { Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}
  async transform(passord: string) {
    const salt = this.configService.get<string>('HASHING_SECRET');

    return await bcrypt.hash(passord, salt!);
  }
}