import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TumorType } from '@domain/entities/tumor-type.entity';
import { ClinicalRecordTypeOrmEntity } from './clinical-record.typeorm.entity';

@Entity('tumor_types')
export class TumorTypeTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'system_affected', length: 100 })
  systemAffected: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => ClinicalRecordTypeOrmEntity,
    (clinicalRecord) => clinicalRecord.tumorType,
  )
  clinicalRecords: ClinicalRecordTypeOrmEntity[];

  static toDomain(entity: TumorTypeTypeOrmEntity): TumorType {
    return new TumorType(
      entity.id,
      entity.name,
      entity.systemAffected,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static fromDomain(tumorType: TumorType): TumorTypeTypeOrmEntity {
    const entity = new TumorTypeTypeOrmEntity();
    entity.id = tumorType.id;
    entity.name = tumorType.name;
    entity.systemAffected = tumorType.systemAffected;
    return entity;
  }
}

