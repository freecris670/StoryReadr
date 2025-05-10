import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Настраиваем глобальный ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет свойства, не определенные в DTO
      transform: true, // Преобразует примитивы в нужные типы
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если передано свойство, не описанное в DTO
    }),
  );
  
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT || 4000);
  console.log(`Backend running on http://localhost:${process.env.PORT || 4000}`);
}
bootstrap();