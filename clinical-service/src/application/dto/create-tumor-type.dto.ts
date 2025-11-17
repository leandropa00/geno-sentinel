import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTumorTypeDto {
  @ApiProperty({
    example: 'Cáncer de Mama',
    description: 'Name of the tumor type',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Glándulas',
    description: 'System affected by the tumor',
  })
  @IsString()
  @IsNotEmpty()
  systemAffected: string;
}

