import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTumorTypeDto {
  @ApiProperty({
    example: 'Cáncer de Mama',
    description: 'Name of the tumor type',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Glándulas',
    description: 'System affected by the tumor',
    required: false,
  })
  @IsString()
  @IsOptional()
  systemAffected?: string;
}

