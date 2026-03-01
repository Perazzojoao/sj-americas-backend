import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from 'src/lib/hash-password';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.connectWithRetry();

    const adminPassword = this.configService.get<string>('ADMIN_SECRET_KEY');
    if (!adminPassword) {
      throw new Error('ADMIN_SECRET_KEY environment variable is not set');
    }

    const hashedPassword = await hashPassword(adminPassword);
    const time = new Date();
    await this
      .$executeRaw`INSERT INTO users (user_name, password, role, created_by, "createdAt", "updatedAt") VALUES ('admin',${hashedPassword}, 'SUPER_ADMIN', NULL, ${time}, ${time}) ON CONFLICT (user_name) DO NOTHING`;
  }

  private async connectWithRetry(
    maxAttempts = 3,
    initialDelayMs = 500,
  ): Promise<void> {
    let delayMs = initialDelayMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        return;
      } catch (error) {
        this.logger.warn(
          `Database connection attempt ${attempt}/${maxAttempts} failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );

        if (attempt === maxAttempts) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }
  }
}
