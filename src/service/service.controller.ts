import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../entities/utilisateur.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post(':prestataireId')
  @Roles(Role.PRESTATAIRE)
  async create(
    @Param('prestataireId') prestataireId: string,
    @Body() body: CreateServiceDto,
    @Req() req,
  ) {
    if (prestataireId !== req.user.userId) {
      throw new ForbiddenException(
        "Vous ne pouvez créer un service que pour vous-même!",
      );
    }
    return this.serviceService.create(body, prestataireId);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get('prestataire/:id')
  findByPrestataire(@Param('id') id: string) {
    return this.serviceService.findByPrestataire((id));
  }

  @Patch(':id')
  @Roles(Role.PRESTATAIRE)
  async update(
    @Param('id') id: string, 
    @Body() dto: UpdateServiceDto, 
    @Req() req
  ) {
    const service = await this.serviceService.findOne(id);
    if (service.prestataire.id !== req.user.userId) {
      throw new ForbiddenException(
        "Vous ne pouvez modifier que vos propres services",
      );
    }
    return this.serviceService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.PRESTATAIRE)
  async remove(
    @Param('id') id: string, 
    @Req() req
  ) {
    const service = await this.serviceService.findOne(id);
    if (service.prestataire.id !== req.user.userId) {
      throw new ForbiddenException(
        "Vous ne pouvez supprimer que vos propres services",
      );
    }
    return this.serviceService.remove(id);
  }
}
