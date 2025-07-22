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
  constructor(private readonly calendrierService: CalendarService) {}

  @Post('Unavailability')
  @Roles(Role.PROVIDER)
  async addUnavailability(
    @Body() dto: CreateUnavailabilityDto,
    @Req() req: any,
  ) {
    const providerId = req.user.id;
    return this.calendrierService.addUnavailability(dto, providerId);
  }

  @Get('Unavailabilities')
  @Roles(Role.PROVIDER)
  async getUnavailabilities(@Req() req: any) {
    return this.calendrierService.getUnavailabilities(req.user.id);
  }
}
