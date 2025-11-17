import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsUUID, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateClinicalRecordDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Patient ID',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  patientId?: string;

  @ApiProperty({
    example: 1,
    description: 'Tumor Type ID',
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  tumorTypeId?: number;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Diagnosis date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  diagnosisDate?: string;

  @ApiProperty({
    example: 'IIA',
    description: 'Cancer stage',
    required: false,
  })
  @IsString()
  @IsOptional()
  stage?: string;

  @ApiProperty({
    example: 'Protocolo de quimioterapia estándar',
    description: 'Treatment protocol',
    required: false,
  })
  @IsString()
  @IsOptional()
  treatmentProtocol?: string;
}

