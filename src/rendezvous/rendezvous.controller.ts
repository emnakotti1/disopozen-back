import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { RendezVousService } from './rendezvous.service';
import { CreateRendezVousDto } from './dto/create-rendezvous.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rendezvous')
@UseGuards(JwtAuthGuard)
export class RendezVousController {
  constructor(private readonly rendezVousService: RendezVousService) {}

  @Post()
  async prendreRendezVous(@Body() dto: any, @Req() req: any) {
    console.log('test req', req.user);
    return this.rendezVousService.prendreRendezVous(dto, req.user.id);
  }

  @Get('client/:clientId')
  async getRdvClient(@Param('clientId') clientId: string) {
    return this.rendezVousService.getRdvClient(clientId);
  }

  @Get('prestataire/:prestataireId')
  async getRdvPrestataire(@Param('prestataireId') prestataireId: string) {
    return this.rendezVousService.getRdvPrestataire(prestataireId);
  }

  @Patch(':id')
  async modifier(@Param('id') id: string, @Body() dto: CreateRendezVousDto) {
    return this.rendezVousService.modifierRendezVous(id, dto);
  }

  @Patch('annuler/:id')
  async annulerRdv(@Param('id') id: string, @Req() req: any) {
    return this.rendezVousService.annulerRendezVous(id, req.user.userId);
  }

  @Patch('confirmer/:id')
  async confirmerRdv(@Param('id') id: string, @Req() req: any) {
    return this.rendezVousService.confirmerRendezVous(id, req.user.userId);
  }
}
