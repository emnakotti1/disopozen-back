import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';  // Import nécessaire pour join()
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Activer CORS pour le frontend
  app.enableCors({
    origin: 'http://localhost:5173',  // URL de ton Frontend
    credentials: true,                // Si tu utilises des cookies ou des headers Authorization
  });

  // Servir le dossier uploads statiquement
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/users',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
