import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PatientRepositoryPort } from '@domain/repositories/patient.repository.port';
import { Patient, PatientStatus } from '@domain/entities/patient.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientUseCases {
  constructor(
    @Inject('PatientRepositoryPort')
    private readonly patientRepository: PatientRepositoryPort,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = new Patient(
      uuidv4(),
      createPatientDto.firstName,
      createPatientDto.lastName,
      new Date(createPatientDto.birthDate),
      createPatientDto.gender,
      createPatientDto.status || PatientStatus.ACTIVO,
    );
    return await this.patientRepository.create(patient);
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return await this.patientRepository.findAll();
  }

  async updatePatient(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const existingPatient = await this.patientRepository.findById(id);
    if (!existingPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const updateData: Partial<Patient> = {};
    if (updatePatientDto.firstName !== undefined) {
      updateData.firstName = updatePatientDto.firstName;
    }
    if (updatePatientDto.lastName !== undefined) {
      updateData.lastName = updatePatientDto.lastName;
    }
    if (updatePatientDto.birthDate !== undefined) {
      updateData.birthDate = new Date(updatePatientDto.birthDate);
    }
    if (updatePatientDto.gender !== undefined) {
      updateData.gender = updatePatientDto.gender;
    }
    if (updatePatientDto.status !== undefined) {
      updateData.status = updatePatientDto.status;
    }

    return await this.patientRepository.update(id, updateData);
  }

  async deactivatePatient(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return await this.patientRepository.update(id, {
      status: PatientStatus.INACTIVO,
    });
  }

  async getPatientsByStatus(status: string): Promise<Patient[]> {
    return await this.patientRepository.findByStatus(status);
  }
}

