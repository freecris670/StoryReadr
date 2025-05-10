import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT || 4000);
  console.log(`Backend running on http://localhost:${process.env.PORT || 4000}`);
}
bootstrap();