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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TumorTypeUseCases } from '@application/use-cases/tumor-type.use-cases';
import { CreateTumorTypeDto } from '@application/dto/create-tumor-type.dto';
import { UpdateTumorTypeDto } from '@application/dto/update-tumor-type.dto';
import { TumorTypeResponseDto } from '@application/dto/tumor-type-response.dto';
import { TumorType } from '@domain/entities/tumor-type.entity';

@ApiTags('Tumor Types')
@Controller('tumor-types')
export class TumorTypeController {
  constructor(private readonly tumorTypeUseCases: TumorTypeUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tumor type' })
  @ApiResponse({
    status: 201,
    description: 'Tumor type created successfully',
    type: TumorTypeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTumorTypeDto: CreateTumorTypeDto): Promise<TumorType> {
    return await this.tumorTypeUseCases.createTumorType(createTumorTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tumor types' })
  @ApiResponse({
    status: 200,
    description: 'List of all tumor types',
    type: [TumorTypeResponseDto],
  })
  async findAll(): Promise<TumorType[]> {
    return await this.tumorTypeUseCases.getAllTumorTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tumor type by ID' })
  @ApiParam({ name: 'id', description: 'Tumor Type ID' })
  @ApiResponse({
    status: 200,
    description: 'Tumor type found',
    type: TumorTypeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tumor type not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TumorType> {
    return await this.tumorTypeUseCases.getTumorTypeById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a tumor type' })
  @ApiParam({ name: 'id', description: 'Tumor Type ID' })
  @ApiResponse({
    status: 200,
    description: 'Tumor type updated successfully',
    type: TumorTypeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Tumor type not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTumorTypeDto: UpdateTumorTypeDto,
  ): Promise<TumorType> {
    return await this.tumorTypeUseCases.updateTumorType(id, updateTumorTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a tumor type' })
  @ApiParam({ name: 'id', description: 'Tumor Type ID' })
  @ApiResponse({
    status: 204,
    description: 'Tumor type deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Tumor type not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.tumorTypeUseCases.deleteTumorType(id);
  }
}

