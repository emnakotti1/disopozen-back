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
import { Role } from '../entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post(':providerId')
  @Roles(Role.PROVIDER)
  async create(
    @Param('providerId') providerId: string,
    @Body() body: CreateServiceDto,
    @Req() req,
  ) {
    if (providerId !== req.user.userId) {
      throw new ForbiddenException(
        'You can only create a service for yourself!',
      );
    }
    return this.serviceService.create(body, providerId);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get('provider/:id')
  findByProvider(@Param('id') id: string) {
    return this.serviceService.findByProvider(id);
  }

  @Patch(':id')
  @Roles(Role.PROVIDER)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
    @Req() req,
  ) {
    const service = await this.serviceService.findOne(id);
    if (service.provider.id !== req.user.userId) {
      throw new ForbiddenException(
        'You can only modify your own services.',
      );
    }
    return this.serviceService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.PROVIDER)
  async remove(@Param('id') id: string, @Req() req) {
    const service = await this.serviceService.findOne(id);
    if (service.provider.id !== req.user.userId) {
      throw new ForbiddenException(
        'You can only delete your own services',
      );
    }
    return this.serviceService.remove(id);
  }
}
