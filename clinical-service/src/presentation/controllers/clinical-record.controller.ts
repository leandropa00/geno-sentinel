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
import { ClinicalRecordUseCases } from '@application/use-cases/clinical-record.use-cases';
import { CreateClinicalRecordDto } from '@application/dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from '@application/dto/update-clinical-record.dto';
import { ClinicalRecordResponseDto } from '@application/dto/clinical-record-response.dto';
import { ClinicalRecord } from '@domain/entities/clinical-record.entity';

@ApiTags('Clinical Records')
@Controller('clinical-records')
export class ClinicalRecordController {
  constructor(
    private readonly clinicalRecordUseCases: ClinicalRecordUseCases,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clinical record' })
  @ApiResponse({
    status: 201,
    description: 'Clinical record created successfully',
    type: ClinicalRecordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Patient or Tumor Type not found' })
  async create(
    @Body() createClinicalRecordDto: CreateClinicalRecordDto,
  ): Promise<ClinicalRecord> {
    return await this.clinicalRecordUseCases.createClinicalRecord(
      createClinicalRecordDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all clinical records' })
  @ApiResponse({
    status: 200,
    description: 'List of all clinical records',
    type: [ClinicalRecordResponseDto],
  })
  async findAll(): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordUseCases.getAllClinicalRecords();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a clinical record by ID' })
  @ApiParam({ name: 'id', description: 'Clinical Record UUID' })
  @ApiResponse({
    status: 200,
    description: 'Clinical record found',
    type: ClinicalRecordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Clinical record not found' })
  async findOne(@Param('id') id: string): Promise<ClinicalRecord> {
    return await this.clinicalRecordUseCases.getClinicalRecordById(id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all clinical records for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of clinical records for the patient',
    type: [ClinicalRecordResponseDto],
  })
  async findByPatientId(
    @Param('patientId') patientId: string,
  ): Promise<ClinicalRecord[]> {
    return await this.clinicalRecordUseCases.getClinicalRecordsByPatientId(
      patientId,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a clinical record' })
  @ApiParam({ name: 'id', description: 'Clinical Record UUID' })
  @ApiResponse({
    status: 200,
    description: 'Clinical record updated successfully',
    type: ClinicalRecordResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Clinical record not found' })
  async update(
    @Param('id') id: string,
    @Body() updateClinicalRecordDto: UpdateClinicalRecordDto,
  ): Promise<ClinicalRecord> {
    return await this.clinicalRecordUseCases.updateClinicalRecord(
      id,
      updateClinicalRecordDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a clinical record' })
  @ApiParam({ name: 'id', description: 'Clinical Record UUID' })
  @ApiResponse({
    status: 204,
    description: 'Clinical record deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Clinical record not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.clinicalRecordUseCases.deleteClinicalRecord(id);
  }
}

