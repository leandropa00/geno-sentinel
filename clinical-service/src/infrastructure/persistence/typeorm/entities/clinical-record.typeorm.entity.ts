import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClinicalRecord } from '@domain/entities/clinical-record.entity';
import { PatientTypeOrmEntity } from './patient.typeorm.entity';
import { TumorTypeTypeOrmEntity } from './tumor-type.typeorm.entity';

@Entity('clinical_records')
export class ClinicalRecordTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @Column({ name: 'tumor_type_id' })
  tumorTypeId: number;

  @Column({ name: 'diagnosis_date', type: 'date' })
  diagnosisDate: Date;

  @Column({ length: 50 })
  stage: string;

  @Column({ name: 'treatment_protocol', type: 'text' })
  treatmentProtocol: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => PatientTypeOrmEntity, (patient) => patient.clinicalRecords)
  @JoinColumn({ name: 'patient_id' })
  patient: PatientTypeOrmEntity;

  @ManyToOne(
    () => TumorTypeTypeOrmEntity,
    (tumorType) => tumorType.clinicalRecords,
  )
  @JoinColumn({ name: 'tumor_type_id' })
  tumorType: TumorTypeTypeOrmEntity;

  static toDomain(entity: ClinicalRecordTypeOrmEntity): ClinicalRecord {
    return new ClinicalRecord(
      entity.id,
      entity.patientId,
      entity.tumorTypeId,
      entity.diagnosisDate,
      entity.stage,
      entity.treatmentProtocol,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static fromDomain(clinicalRecord: ClinicalRecord): ClinicalRecordTypeOrmEntity {
    const entity = new ClinicalRecordTypeOrmEntity();
    entity.id = clinicalRecord.id;
    entity.patientId = clinicalRecord.patientId;
    entity.tumorTypeId = clinicalRecord.tumorTypeId;
    entity.diagnosisDate = clinicalRecord.diagnosisDate;
    entity.stage = clinicalRecord.stage;
    entity.treatmentProtocol = clinicalRecord.treatmentProtocol;
    return entity;
  }
}

