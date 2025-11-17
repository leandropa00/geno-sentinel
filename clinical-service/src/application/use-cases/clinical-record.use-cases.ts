import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ClinicalRecordRepositoryPort } from '@domain/repositories/clinical-record.repository.port';
import { PatientRepositoryPort } from '@domain/repositories/patient.repository.port';
import { TumorTypeRepositoryPort } from '@domain/repositories/tumor-type.repository.port';
import { ClinicalRecord } from '@domain/entities/clinical-record.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateClinicalRecordDto } from '../dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from '../dto/update-clinical-record.dto';

@Injectable()
export class ClinicalRecordUseCases {
  constructor(
    @Inject('ClinicalRecordRepositoryPort')
    private readonly clinicalRecordRepository: ClinicalRecordRepositoryPort,
    @Inject('PatientRepositoryPort')
    private readonly patientRepository: PatientRepositoryPort,
    @Inject('TumorTypeRepositoryPort')
    private readonly tumorTypeRepository: TumorTypeRepositoryPort,
  ) {}

  async createClinicalRecord(
    createClinicalRecordDto: CreateClinicalRecordDto,
  ): Promise<ClinicalRecord> {
    // Validate patient exists
    const patient = await this.patientRepository.findById(
      createClinicalRecordDto.patientId,
    );
    if (!patient) {
      throw new NotFoundException(
        `Patient with ID ${createClinicalRecordDto.patientId} not found`,
      );
    }

    // Validate tumor type exists
    const tumorType = await this.tumorTypeRepository.findById(
      createClinicalRecordDto.tumorTypeId,
    );
    if (!tumorType) {
      throw new NotFoundException(
        `TumorType with ID ${createClinicalRecordDto.tumorTypeId} not found`,
      );
    }

    const clinicalRecord = new ClinicalRecord(
      uuidv4(),
      createClinicalRecordDto.patientId,
      createClinicalRecordDto.tumorTypeId,
      new Date(createClinicalRecordDto.diagnosisDate),
      createClinicalRecordDto.stage,
      createClinicalRecordDto.treatmentProtocol,
    );

    return await this.clinicalRecordRepository.create(clinicalRecord);
  }

  async getClinicalRecordById(id: string): Promise<ClinicalRecord> {
    const clinicalRecord = await this.clinicalRecordRepository.findById(id);
    if (!clinicalRecord) {
      throw new NotFoundException(`ClinicalRecord with ID ${id} not found`);
    }
    return clinicalRecord;
  }

  async getAllClinicalRecords(): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordRepository.findAll();
  }

  async getClinicalRecordsByPatientId(
    patientId: string,
  ): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordRepository.findByPatientId(patientId);
  }

  async updateClinicalRecord(
    id: string,
    updateClinicalRecordDto: UpdateClinicalRecordDto,
  ): Promise<ClinicalRecord> {
    const existingRecord = await this.clinicalRecordRepository.findById(id);
    if (!existingRecord) {
      throw new NotFoundException(`ClinicalRecord with ID ${id} not found`);
    }

    // Validate patient if provided
    if (updateClinicalRecordDto.patientId) {
      const patient = await this.patientRepository.findById(
        updateClinicalRecordDto.patientId,
      );
      if (!patient) {
        throw new NotFoundException(
          `Patient with ID ${updateClinicalRecordDto.patientId} not found`,
        );
      }
    }

    // Validate tumor type if provided
    if (updateClinicalRecordDto.tumorTypeId) {
      const tumorType = await this.tumorTypeRepository.findById(
        updateClinicalRecordDto.tumorTypeId,
      );
      if (!tumorType) {
        throw new NotFoundException(
          `TumorType with ID ${updateClinicalRecordDto.tumorTypeId} not found`,
        );
      }
    }

    const updateData: Partial<ClinicalRecord> = {};
    if (updateClinicalRecordDto.patientId !== undefined) {
      updateData.patientId = updateClinicalRecordDto.patientId;
    }
    if (updateClinicalRecordDto.tumorTypeId !== undefined) {
      updateData.tumorTypeId = updateClinicalRecordDto.tumorTypeId;
    }
    if (updateClinicalRecordDto.diagnosisDate !== undefined) {
      updateData.diagnosisDate = new Date(updateClinicalRecordDto.diagnosisDate);
    }
    if (updateClinicalRecordDto.stage !== undefined) {
      updateData.stage = updateClinicalRecordDto.stage;
    }
    if (updateClinicalRecordDto.treatmentProtocol !== undefined) {
      updateData.treatmentProtocol = updateClinicalRecordDto.treatmentProtocol;
    }

    return await this.clinicalRecordRepository.update(id, updateData);
  }

  async deleteClinicalRecord(id: string): Promise<void> {
    const clinicalRecord = await this.clinicalRecordRepository.findById(id);
    if (!clinicalRecord) {
      throw new NotFoundException(`ClinicalRecord with ID ${id} not found`);
    }
    await this.clinicalRecordRepository.delete(id);
  }
}

