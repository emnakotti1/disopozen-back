import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateUnavailabilityDto } from './dto/create-indisponibilite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('Unavailability')
  @Roles(Role.PROVIDER)
  async addUnavailability(
    @Body() dto: CreateUnavailabilityDto,
    @Req() req: any,
  ) {
    console.log('Utilisateur connecté (req.user):', req.user);
    const providerId = req.user.userId;
    return this.calendarService.addUnavailability(dto, providerId);
  }

  @Get('Unavailabilities')
  @Roles(Role.PROVIDER)
  async getUnavailabilities(@Req() req: any) {
    return this.calendarService.getUnavailabilities(req.user.userId);
  }

  @Get('me/full')
  @Roles(Role.PROVIDER)
  async getMyFullCalendar(@Req() req) {
    const providerId = req.user.userId;
    return this.calendarService.getFullCalendar(providerId);
  }
}
