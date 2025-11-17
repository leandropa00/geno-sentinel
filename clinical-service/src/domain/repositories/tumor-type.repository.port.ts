import { TumorType } from '../entities/tumor-type.entity';

export interface TumorTypeRepositoryPort {
  create(tumorType: TumorType): Promise<TumorType>;
  findById(id: number): Promise<TumorType | null>;
  findAll(): Promise<TumorType[]>;
  update(id: number, tumorType: Partial<TumorType>): Promise<TumorType>;
  delete(id: number): Promise<void>;
}

