import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
import { User, Role } from '../entities/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createClientForProvider(
    providerId: string,
    createClientDto: CreateClientDto,
  ): Promise<Client> {
    // Vérifier que le provider existe et a le bon rôle
    const provider = await this.userRepository.findOne({
      where: { id: providerId, role: Role.PROVIDER },
    });
    if (!provider) {
      throw new NotFoundException('Prestataire non trouvé');
    }

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: createClientDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Générer un mot de passe temporaire
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Créer l'utilisateur client
    const clientUser = this.userRepository.create({
      firstName: createClientDto.firstName,
      lastName: createClientDto.lastName,
      email: createClientDto.email,
      password: hashedPassword,
      phoneNumber: createClientDto.phone || '',
      role: Role.CLIENT,
      registrationDate: new Date(),
    });

    const savedClientUser = await this.userRepository.save(clientUser);

    // Créer la relation client
    const client = this.clientRepository.create({
      user: savedClientUser,
      userId: savedClientUser.id,
      provider,
      providerId,
      phone: createClientDto.phone,
      address: createClientDto.address,
      notes: createClientDto.notes,
    });

    const savedClient = await this.clientRepository.save(client);

    // Retourner le client avec les informations utilisateur
    const result = await this.clientRepository.findOne({
      where: { id: savedClient.id },
      relations: ['user'],
    });

    if (!result) {
      throw new NotFoundException('Erreur lors de la création du client');
    }

    return result;
  }

  async getClientsByProvider(providerId: string): Promise<Client[]> {
    const provider = await this.userRepository.findOne({
      where: { id: providerId, role: Role.PROVIDER },
    });
    if (!provider) {
      throw new NotFoundException('Prestataire non trouvé');
    }

    return await this.clientRepository.find({
      where: { providerId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getClientById(clientId: number, providerId: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId, providerId },
      relations: ['user', 'provider'],
    });

    if (!client) {
      throw new NotFoundException('Client non trouvé');
    }

    return client;
  }

  async updateClient(
    clientId: number,
    providerId: string,
    updateData: Partial<CreateClientDto>,
  ): Promise<Client> {
    const client = await this.getClientById(clientId, providerId);

    // Mettre à jour les données utilisateur
    if (updateData.firstName || updateData.lastName || updateData.email) {
      await this.userRepository.update(client.userId, {
        firstName: updateData.firstName || client.user.firstName,
        lastName: updateData.lastName || client.user.lastName,
        email: updateData.email || client.user.email,
      });
    }

    // Mettre à jour les données client
    await this.clientRepository.update(clientId, {
      phone: updateData.phone ?? client.phone,
      address: updateData.address ?? client.address,
      notes: updateData.notes ?? client.notes,
    });

    return await this.getClientById(clientId, providerId);
  }

  async deleteClient(clientId: number, providerId: string): Promise<void> {
    const client = await this.getClientById(clientId, providerId);

    // Supprimer le client (l'utilisateur sera supprimé en cascade)
    await this.clientRepository.remove(client);
  }
}
