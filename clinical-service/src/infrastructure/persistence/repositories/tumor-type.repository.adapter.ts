import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TumorTypeRepositoryPort } from '@domain/repositories/tumor-type.repository.port';
import { TumorType } from '@domain/entities/tumor-type.entity';
import { TumorTypeTypeOrmEntity } from '../typeorm/entities/tumor-type.typeorm.entity';

@Injectable()
export class TumorTypeRepositoryAdapter implements TumorTypeRepositoryPort {
  constructor(
    @InjectRepository(TumorTypeTypeOrmEntity)
    private readonly tumorTypeRepository: Repository<TumorTypeTypeOrmEntity>,
  ) {}

  async create(tumorType: TumorType): Promise<TumorType> {
    const entity = TumorTypeTypeOrmEntity.fromDomain(tumorType);
    const saved = await this.tumorTypeRepository.save(entity);
    return TumorTypeTypeOrmEntity.toDomain(saved);
  }

  async findById(id: number): Promise<TumorType | null> {
    const entity = await this.tumorTypeRepository.findOne({ where: { id } });
    return entity ? TumorTypeTypeOrmEntity.toDomain(entity) : null;
  }

  async findAll(): Promise<TumorType[]> {
    const entities = await this.tumorTypeRepository.find();
    return entities.map((entity) => TumorTypeTypeOrmEntity.toDomain(entity));
  }

  async update(id: number, tumorType: Partial<TumorType>): Promise<TumorType> {
    await this.tumorTypeRepository.update(id, tumorType);
    const updated = await this.tumorTypeRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`TumorType with id ${id} not found`);
    }
    return TumorTypeTypeOrmEntity.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.tumorTypeRepository.delete(id);
  }
}

