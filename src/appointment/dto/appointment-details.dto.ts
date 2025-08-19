import { Appointment } from '../../entities/appointment.entity';
import { User } from '../../entities/user.entity';
import { Service } from '../../entities/service.entity';
import { Calendar } from '../../entities/Calendar.entity';

export class AppointmentDetailsDto {
  id: string;
  createdAt: Date;
  status: string;
  isValidated: boolean;
  isCancelled: boolean;
  notes?: string;
  client: Omit<User, 'password'>;
  provider: Omit<User, 'password'>;
  service: Service;
  calendar: Calendar | null;

  constructor(appointment: Appointment) {
    this.id = appointment.id;
    this.createdAt = appointment.createdAt;
    this.status = appointment.status;
    this.isValidated = appointment.isValidated;
    this.isCancelled = appointment.isCancelled;
    this.notes = appointment.notes;

    // Supprimer les mots de passe des données utilisateur
    if (appointment.client) {
      const { password, ...clientWithoutPassword } = appointment.client;
      this.client = clientWithoutPassword;
    }

    if (appointment.provider) {
      const { password, ...providerWithoutPassword } = appointment.provider;
      this.provider = providerWithoutPassword;
    }

    this.service = appointment.service;
    this.calendar = appointment.calendar;
  }
}
