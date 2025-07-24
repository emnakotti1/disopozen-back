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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-Appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointment')
@UseGuards(JwtAuthGuard)
export class AppointmentController {
  constructor(private readonly AppointmentService: AppointmentService) {}

  @Post()
  async prendreRendezVous(@Body() dto: any, @Req() req: any) {
    console.log('test req', req.user);
    return this.AppointmentService.getAppointment(dto, req.user.userId);

  }

  @Get('client/:clientId')
  async getRdvClient(@Param('clientId') clientId: string) {
    return this.AppointmentService.getAptClient(clientId);
  }

  @Get('prestataire/:prestataireId')
  async getRdvPrestataire(@Param('prestataireId') prestataireId: string) {
    return this.AppointmentService.getAptprovider(prestataireId);
  }

  @Patch(':id')
  async modifier(@Param('id') id: string, @Body() dto: CreateAppointmentDto) {
    return this.AppointmentService.updateAppointment(id, dto);
  }

  @Patch('delete/:id')
  async annulerRdv(@Param('id') id: string, @Req() req: any) {
    return this.AppointmentService.cancelAppointment(id, req.user.userId);
  }

  @Patch('confirme/:id')
  async confirmerRdv(@Param('id') id: string, @Req() req: any) {
    return this.AppointmentService.confirmAppointment(id, req.user.userId);
  }
}
