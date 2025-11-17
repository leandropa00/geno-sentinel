import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { Gender, PatientStatus } from '@domain/entities/patient.entity';

export class CreatePatientDto {
  @ApiProperty({ example: 'Juan', description: 'First name of the patient' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Last name of the patient' })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: '1990-01-15',
    description: 'Birth date of the patient',
  })
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    example: Gender.MALE,
    enum: Gender,
    description: 'Gender of the patient',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    example: PatientStatus.ACTIVO,
    enum: PatientStatus,
    description: 'Status of the patient',
    required: false,
    default: PatientStatus.ACTIVO,
  })
  @IsEnum(PatientStatus)
  @IsOptional()
  status?: PatientStatus;
}

