import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm/typeorm.config';
import { PatientTypeOrmEntity } from './typeorm/entities/patient.typeorm.entity';
import { TumorTypeTypeOrmEntity } from './typeorm/entities/tumor-type.typeorm.entity';
import { ClinicalRecordTypeOrmEntity } from './typeorm/entities/clinical-record.typeorm.entity';
import { PatientRepositoryAdapter } from './repositories/patient.repository.adapter';
import { TumorTypeRepositoryAdapter } from './repositories/tumor-type.repository.adapter';
import { ClinicalRecordRepositoryAdapter } from './repositories/clinical-record.repository.adapter';
import { PatientRepositoryPort } from '@domain/repositories/patient.repository.port';
import { TumorTypeRepositoryPort } from '@domain/repositories/tumor-type.repository.port';
import { ClinicalRecordRepositoryPort } from '@domain/repositories/clinical-record.repository.port';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      PatientTypeOrmEntity,
      TumorTypeTypeOrmEntity,
      ClinicalRecordTypeOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: 'PatientRepositoryPort',
      useClass: PatientRepositoryAdapter,
    },
    {
      provide: 'TumorTypeRepositoryPort',
      useClass: TumorTypeRepositoryAdapter,
    },
    {
      provide: 'ClinicalRecordRepositoryPort',
      useClass: ClinicalRecordRepositoryAdapter,
    },
  ],
  exports: [
    'PatientRepositoryPort',
    'TumorTypeRepositoryPort',
    'ClinicalRecordRepositoryPort',
  ],
})
export class PersistenceModule {}

