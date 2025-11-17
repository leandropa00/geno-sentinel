export enum PatientStatus {
  ACTIVO = 'Activo',
  SEGUIMIENTO = 'Seguimiento',
  INACTIVO = 'Inactivo',
}

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'O',
}

export class Patient {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public birthDate: Date,
    public gender: Gender,
    public status: PatientStatus,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

