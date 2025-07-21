import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { CalendrierService } from './calendrier.service';
import { CreateUnavailabilityDto } from './dto/create-indisponibilite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';

@Controller('calendrier')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalendrierController {
  constructor(private readonly calendrierService: CalendrierService) {}

  @Post('indisponibilite')
  @Roles(Role.PROVIDER)
  async ajouterIndisponibilite(
    @Body() dto: CreateUnavailabilityDto,
    @Req() req: any,
  ) {
    const prestataireId = req.user.id;
    return this.calendrierService.ajouterIndisponibilite(dto, prestataireId);
  }

  @Get('mes-indisponibilites')
  @Roles(Role.PROVIDER)
  async voirIndisponibilites(@Req() req: any) {
    return this.calendrierService.getIndisponibilites(req.user.id);
  }
}
