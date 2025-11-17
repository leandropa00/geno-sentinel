import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalRecordRepositoryPort } from '@domain/repositories/clinical-record.repository.port';
import { ClinicalRecord } from '@domain/entities/clinical-record.entity';
import { ClinicalRecordTypeOrmEntity } from '../typeorm/entities/clinical-record.typeorm.entity';

@Injectable()
export class ClinicalRecordRepositoryAdapter
  implements ClinicalRecordRepositoryPort
{
  constructor(
    @InjectRepository(ClinicalRecordTypeOrmEntity)
    private readonly clinicalRecordRepository: Repository<ClinicalRecordTypeOrmEntity>,
  ) {}

  async create(clinicalRecord: ClinicalRecord): Promise<ClinicalRecord> {
    const entity = ClinicalRecordTypeOrmEntity.fromDomain(clinicalRecord);
    const saved = await this.clinicalRecordRepository.save(entity);
    return ClinicalRecordTypeOrmEntity.toDomain(saved);
  }

  async findById(id: string): Promise<ClinicalRecord | null> {
    const entity = await this.clinicalRecordRepository.findOne({
      where: { id },
      relations: ['patient', 'tumorType'],
    });
    return entity ? ClinicalRecordTypeOrmEntity.toDomain(entity) : null;
  }

  async findAll(): Promise<ClinicalRecord[]> {
    const entities = await this.clinicalRecordRepository.find({
      relations: ['patient', 'tumorType'],
    });
    return entities.map((entity) =>
      ClinicalRecordTypeOrmEntity.toDomain(entity),
    );
  }

  async findByPatientId(patientId: string): Promise<ClinicalRecord[]> {
    const entities = await this.clinicalRecordRepository.find({
      where: { patientId },
      relations: ['patient', 'tumorType'],
    });
    return entities.map((entity) =>
      ClinicalRecordTypeOrmEntity.toDomain(entity),
    );
  }

  async update(
    id: string,
    clinicalRecord: Partial<ClinicalRecord>,
  ): Promise<ClinicalRecord> {
    await this.clinicalRecordRepository.update(id, clinicalRecord);
    const updated = await this.clinicalRecordRepository.findOne({
      where: { id },
      relations: ['patient', 'tumorType'],
    });
    if (!updated) {
      throw new Error(`ClinicalRecord with id ${id} not found`);
    }
    return ClinicalRecordTypeOrmEntity.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.clinicalRecordRepository.delete(id);
  }
}

