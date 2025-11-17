export class ClinicalRecord {
  constructor(
    public id: string,
    public patientId: string,
    public tumorTypeId: number,
    public diagnosisDate: Date,
    public stage: string,
    public treatmentProtocol: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

