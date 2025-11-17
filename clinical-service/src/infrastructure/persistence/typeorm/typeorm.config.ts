import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PatientTypeOrmEntity } from './entities/patient.typeorm.entity';
import { TumorTypeTypeOrmEntity } from './entities/tumor-type.typeorm.entity';
import { ClinicalRecordTypeOrmEntity } from './entities/clinical-record.typeorm.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'clinical_db',
  entities: [
    PatientTypeOrmEntity,
    TumorTypeTypeOrmEntity,
    ClinicalRecordTypeOrmEntity,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
};

