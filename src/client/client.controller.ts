import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../entities/user.entity';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PROVIDER)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async createClient(@Request() req, @Body() createClientDto: CreateClientDto) {
    const providerId = req.user.id;
    return await this.clientService.createClientForProvider(
      providerId,
      createClientDto,
    );
  }

  @Get('provider/:providerId')
  @UseGuards(JwtAuthGuard) // Authentification requise mais pas de restriction de rôle
  async getClientsByProviderId(
    @Param('providerId') providerId: string,
    @Request() req,
  ) {
    // Permettre aux prestataires de voir leurs propres clients ou aux admins de voir tous les clients
    const currentUser = req.user;

    // Si l'utilisateur est un prestataire, il ne peut voir que ses propres clients
    if (currentUser.role === Role.PROVIDER && currentUser.id !== providerId) {
      throw new ForbiddenException(
        'Accès refusé : vous ne pouvez voir que vos propres clients',
      );
    }

    return await this.clientService.getClientsByProvider(providerId);
  }

  @Get()
  async getMyClients(@Request() req) {
    const providerId = req.user.id;
    return await this.clientService.getClientsByProvider(providerId);
  }

  @Get(':id')
  async getClient(@Request() req, @Param('id', ParseIntPipe) clientId: number) {
    const providerId = req.user.id;
    return await this.clientService.getClientById(clientId, providerId);
  }

  @Put(':id')
  async updateClient(
    @Request() req,
    @Param('id', ParseIntPipe) clientId: number,
    @Body() updateClientDto: Partial<CreateClientDto>,
  ) {
    const providerId = req.user.id;
    return await this.clientService.updateClient(
      clientId,
      providerId,
      updateClientDto,
    );
  }

  @Delete(':id')
  async deleteClient(
    @Request() req,
    @Param('id', ParseIntPipe) clientId: number,
  ) {
    const providerId = req.user.id;
    await this.clientService.deleteClient(clientId, providerId);
    return { message: 'Client supprimé avec succès' };
  }
}
