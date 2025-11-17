import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PatientUseCases } from '@application/use-cases/patient.use-cases';
import { CreatePatientDto } from '@application/dto/create-patient.dto';
import { UpdatePatientDto } from '@application/dto/update-patient.dto';
import { PatientResponseDto } from '@application/dto/patient-response.dto';
import { Patient } from '@domain/entities/patient.entity';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientUseCases: PatientUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return await this.patientUseCases.createPatient(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({
    status: 200,
    description: 'List of all patients',
    type: [PatientResponseDto],
  })
  async findAll(): Promise<Patient[]> {
    return await this.patientUseCases.getAllPatients();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiParam({ name: 'id', description: 'Patient UUID' })
  @ApiResponse({
    status: 200,
    description: 'Patient found',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findOne(@Param('id') id: string): Promise<Patient> {
    return await this.patientUseCases.getPatientById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiParam({ name: 'id', description: 'Patient UUID' })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return await this.patientUseCases.updatePatient(id, updatePatientDto);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a patient' })
  @ApiParam({ name: 'id', description: 'Patient UUID' })
  @ApiResponse({
    status: 200,
    description: 'Patient deactivated successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async deactivate(@Param('id') id: string): Promise<Patient> {
    return await this.patientUseCases.deactivatePatient(id);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get patients by status' })
  @ApiParam({ name: 'status', description: 'Patient status' })
  @ApiResponse({
    status: 200,
    description: 'List of patients with the specified status',
    type: [PatientResponseDto],
  })
  async findByStatus(@Param('status') status: string): Promise<Patient[]> {
    return await this.patientUseCases.getPatientsByStatus(status);
  }
}

