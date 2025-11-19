export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'O'
}

export enum PatientStatus {
  ACTIVO = 'Activo',
  SEGUIMIENTO = 'Seguimiento',
  INACTIVO = 'Inactivo'
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | Date;
  gender: Gender;
  status: PatientStatus;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  status?: PatientStatus;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: Gender;
  status?: PatientStatus;
}

