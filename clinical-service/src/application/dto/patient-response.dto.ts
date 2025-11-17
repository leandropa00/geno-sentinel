import { ApiProperty } from '@nestjs/swagger';
import { Gender, PatientStatus } from '@domain/entities/patient.entity';

export class PatientResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  lastName: string;

  @ApiProperty({ example: '1990-01-15' })
  birthDate: Date;

  @ApiProperty({ example: Gender.MALE, enum: Gender })
  gender: Gender;

  @ApiProperty({ example: PatientStatus.ACTIVO, enum: PatientStatus })
  status: PatientStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

