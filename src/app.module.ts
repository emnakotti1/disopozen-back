import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';
import { CalendarModule } from './calendar/calendar.module';
import { AppointmentModule } from './appointment/appointment.module';
import { WorkingHoursModule } from './working-hours/working-hours.module';
import { ClientModule } from './client/client.module';
import { HealthController } from '../src/health.controller';
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
    UserModule,
    AuthModule,
    ServiceModule,
    CalendarModule,
    AppointmentModule,
    WorkingHoursModule,
    ClientModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

