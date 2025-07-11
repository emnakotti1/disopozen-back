import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur, Role } from '../entities/utilisateur.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepo: Repository<Utilisateur>,
    private jwtService: JwtService,
  ) {}

  async register(data: Partial<Utilisateur>) {
    const existing = await this.utilisateurRepo.findOne({ where: { email: data.email } });
    if (existing) {
      throw new UnauthorizedException('Email déjà utilisé');
    }

    if (!data.motDePasse) {
      throw new UnauthorizedException('Mot de passe requis');
    }

    const hashedPassword = await bcrypt.hash(data.motDePasse, 10);

    const newUser = this.utilisateurRepo.create({
      ...data,
      motDePasse: hashedPassword,
      role: data.role || Role.CLIENT, 
    });

    const savedUser = await this.utilisateurRepo.save(newUser);
    const { motDePasse, ...userSansMotDePasse } = savedUser;
    return userSansMotDePasse;
  }

  async login(email: string, password: string) {
    const user = await this.utilisateurRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email incorrect');

    const isValid = await bcrypt.compare(password, user.motDePasse);
    if (!isValid) throw new UnauthorizedException('Mot de passe incorrect');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role, 
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      role: user.role, 
    };
  }

  async validateUser(id: string) {
    const user = await this.utilisateurRepo.findOne({ where: { id } });
    if (!user) return null;

    const { motDePasse, ...userSansMotDePasse } = user;
    return userSansMotDePasse;
  }
}
