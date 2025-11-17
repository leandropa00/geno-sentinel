import { ClinicalRecord } from '../entities/clinical-record.entity';

export interface ClinicalRecordRepositoryPort {
  create(clinicalRecord: ClinicalRecord): Promise<ClinicalRecord>;
  findById(id: string): Promise<ClinicalRecord | null>;
  findAll(): Promise<ClinicalRecord[]>;
  findByPatientId(patientId: string): Promise<ClinicalRecord[]>;
  update(id: string, clinicalRecord: Partial<ClinicalRecord>): Promise<ClinicalRecord>;
  delete(id: string): Promise<void>;
}

