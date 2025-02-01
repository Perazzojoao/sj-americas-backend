import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from 'src/lib/hash-password';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    const adminPassword = this.configService.get<string>('ADMIN_SECRET_KEY');
    if (!adminPassword) {
      throw new Error('ADMIN_SECRET_KEY environment variable is not set');
    }

    const hashedPassword = await hashPassword(adminPassword);
    const time = new Date();
    await this
      .$executeRaw`INSERT INTO users (user_name, password, role, createdAt, updatedAt) VALUES ('admin',${hashedPassword}, 'SUPER_ADMIN', ${time}, ${time}) ON CONFLICT (user_name) DO NOTHING`;
  }
}
