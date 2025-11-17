import { ApiProperty } from '@nestjs/swagger';

export class TumorTypeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Cáncer de Mama' })
  name: string;

  @ApiProperty({ example: 'Glándulas' })
  systemAffected: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

