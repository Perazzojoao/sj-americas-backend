import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    exposedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 120,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(8000);
}
bootstrap();
