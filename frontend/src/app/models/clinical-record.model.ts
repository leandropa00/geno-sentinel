export interface ClinicalRecord {
  id: string;
  patientId: string;
  tumorTypeId: number;
  diagnosisDate: string | Date;
  stage: string;
  treatmentProtocol: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  tumorType?: {
    id: number;
    name: string;
    systemAffected: string;
  };
}

export interface CreateClinicalRecordDto {
  patientId: string;
  tumorTypeId: number;
  diagnosisDate: string;
  stage: string;
  treatmentProtocol: string;
}

export interface UpdateClinicalRecordDto {
  patientId?: string;
  tumorTypeId?: number;
  diagnosisDate?: string;
  stage?: string;
  treatmentProtocol?: string;
}

