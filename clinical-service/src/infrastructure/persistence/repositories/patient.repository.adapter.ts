import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRepositoryPort } from '@domain/repositories/patient.repository.port';
import { Patient } from '@domain/entities/patient.entity';
import { PatientTypeOrmEntity } from '../typeorm/entities/patient.typeorm.entity';

@Injectable()
export class PatientRepositoryAdapter implements PatientRepositoryPort {
  constructor(
    @InjectRepository(PatientTypeOrmEntity)
    private readonly patientRepository: Repository<PatientTypeOrmEntity>,
  ) {}

  async create(patient: Patient): Promise<Patient> {
    const entity = PatientTypeOrmEntity.fromDomain(patient);
    const saved = await this.patientRepository.save(entity);
    return PatientTypeOrmEntity.toDomain(saved);
  }

  async findById(id: string): Promise<Patient | null> {
    const entity = await this.patientRepository.findOne({ where: { id } });
    return entity ? PatientTypeOrmEntity.toDomain(entity) : null;
  }

  async findAll(): Promise<Patient[]> {
    const entities = await this.patientRepository.find();
    return entities.map((entity) => PatientTypeOrmEntity.toDomain(entity));
  }

  async update(id: string, patient: Partial<Patient>): Promise<Patient> {
    await this.patientRepository.update(id, patient);
    const updated = await this.patientRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Patient with id ${id} not found`);
    }
    return PatientTypeOrmEntity.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.patientRepository.delete(id);
  }

  async findByStatus(status: string): Promise<Patient[]> {
    const entities = await this.patientRepository.find({
      where: { status: status as any },
    });
    return entities.map((entity) => PatientTypeOrmEntity.toDomain(entity));
  }
}

