import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Patient, PatientStatus, Gender } from '@domain/entities/patient.entity';
import { ClinicalRecordTypeOrmEntity } from './clinical-record.typeorm.entity';

@Entity('patients')
export class PatientTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'enum', enum: PatientStatus, default: PatientStatus.ACTIVO })
  status: PatientStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => ClinicalRecordTypeOrmEntity,
    (clinicalRecord) => clinicalRecord.patient,
  )
  clinicalRecords: ClinicalRecordTypeOrmEntity[];

  static toDomain(entity: PatientTypeOrmEntity): Patient {
    return new Patient(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.birthDate,
      entity.gender,
      entity.status,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static fromDomain(patient: Patient): PatientTypeOrmEntity {
    const entity = new PatientTypeOrmEntity();
    entity.id = patient.id;
    entity.firstName = patient.firstName;
    entity.lastName = patient.lastName;
    entity.birthDate = patient.birthDate;
    entity.gender = patient.gender;
    entity.status = patient.status;
    return entity;
  }
}

