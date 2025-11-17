import { Patient } from '../entities/patient.entity';

export interface PatientRepositoryPort {
  create(patient: Patient): Promise<Patient>;
  findById(id: string): Promise<Patient | null>;
  findAll(): Promise<Patient[]>;
  update(id: string, patient: Partial<Patient>): Promise<Patient>;
  delete(id: string): Promise<void>;
  findByStatus(status: string): Promise<Patient[]>;
}

