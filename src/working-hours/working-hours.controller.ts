import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkingHoursService } from './working-hours.service';
import { CreateWorkingHoursDto } from './dto/create-working-hours.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../entities/user.entity';

@Controller('working-hours')
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}

  // Récupérer les horaires d'un prestataire (accès public)
  @Get('provider/:providerId')
  async getProviderWorkingHours(@Param('providerId') providerId: string) {
    return this.workingHoursService.getProviderWorkingHours(providerId);
  }

  // Récupérer ses propres horaires (pour le prestataire connecté)
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  async getMyWorkingHours(@Req() req: any) {
    const providerId = req.user.userId;
    return this.workingHoursService.getProviderWorkingHours(providerId);
  }

  // Mettre à jour ses propres horaires (pour le prestataire connecté)
  @Put('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROVIDER)
  async updateMyWorkingHours(
    @Req() req: any,
    @Body() workingHours: CreateWorkingHoursDto[],
  ) {
    const providerId = req.user.userId;
    return this.workingHoursService.updateProviderWorkingHours(providerId, {
      workingHours,
    });
  }
}
