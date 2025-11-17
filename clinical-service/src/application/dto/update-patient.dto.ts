import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Gender, PatientStatus } from '@domain/entities/patient.entity';

export class UpdatePatientDto {
  @ApiProperty({
    example: 'Juan',
    description: 'First name of the patient',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Last name of the patient',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Birth date of the patient',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({
    example: Gender.MALE,
    enum: Gender,
    description: 'Gender of the patient',
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    example: PatientStatus.ACTIVO,
    enum: PatientStatus,
    description: 'Status of the patient',
    required: false,
  })
  @IsEnum(PatientStatus)
  @IsOptional()
  status?: PatientStatus;
}

