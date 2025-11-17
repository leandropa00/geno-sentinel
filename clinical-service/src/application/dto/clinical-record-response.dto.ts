import { ApiProperty } from '@nestjs/swagger';

export class ClinicalRecordResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  patientId: string;

  @ApiProperty({ example: 1 })
  tumorTypeId: number;

  @ApiProperty({ example: '2024-01-15' })
  diagnosisDate: Date;

  @ApiProperty({ example: 'IIA' })
  stage: string;

  @ApiProperty({ example: 'Protocolo de quimioterapia estándar' })
  treatmentProtocol: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

