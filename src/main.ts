import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Allow CORS from configurable origin (Docker: http://localhost)
  const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  app.enableCors({ origin, credentials: true });

  // Consistent API base path for frontend (e.g., /api/users)
  app.setGlobalPrefix('api');

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
