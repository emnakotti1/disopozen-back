import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { CalendrierService } from './calendrier.service';
import { CreateIndisponibiliteDto } from './dto/create-indisponibilite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../entities/utilisateur.entity';
import { RolesGuard } from '../auth/roles.guard';

@Controller('calendrier')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CalendrierController {
  constructor(private readonly calendrierService: CalendrierService) {}

  @Post('indisponibilite')
  @Roles(Role.PRESTATAIRE)
  async ajouterIndisponibilite(
    @Body() dto: CreateIndisponibiliteDto,
    @Req() req: any,
  ) {
    const prestataireId = req.user.id;
    return this.calendrierService.ajouterIndisponibilite(dto, prestataireId);
  }

  @Get('mes-indisponibilites')
  @Roles(Role.PRESTATAIRE)
  async voirIndisponibilites(@Req() req: any) {
    return this.calendrierService.getIndisponibilites(req.user.id);
  }
}
