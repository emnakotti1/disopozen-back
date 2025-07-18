import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';
import { CalendrierModule } from './calendrier/calendrier.module';
import { RendezvousModule } from './rendezvous/rendezvous.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: true, // OK pour dev
      logging: true, 
      entities: [__dirname + '/**/*.entity.{ts,js}'], 
    }),
    UtilisateurModule,
    AuthModule,
    ServiceModule,
    CalendrierModule,
    RendezvousModule,
      
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
