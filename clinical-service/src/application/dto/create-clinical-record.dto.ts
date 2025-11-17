import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsUUID, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClinicalRecordDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Patient ID',
  })
  @IsUUID()
  patientId: string;

  @ApiProperty({
    example: 1,
    description: 'Tumor Type ID',
  })
  @Type(() => Number)
  @IsInt()
  tumorTypeId: number;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Diagnosis date',
  })
  @IsDateString()
  diagnosisDate: string;

  @ApiProperty({
    example: 'IIA',
    description: 'Cancer stage',
  })
  @IsString()
  stage: string;

  @ApiProperty({
    example: 'Protocolo de quimioterapia estándar',
    description: 'Treatment protocol',
  })
  @IsString()
  treatmentProtocol: string;
}

