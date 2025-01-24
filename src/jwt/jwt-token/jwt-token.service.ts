import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export interface JwtPayload {
  sub: number;
  user_name: string;
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: UserEntity) {
    const payload: JwtPayload = {
      sub: user.id,
      user_name: user.user_name,
    };
    return await this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync<JwtPayload>(token);
  }
}
