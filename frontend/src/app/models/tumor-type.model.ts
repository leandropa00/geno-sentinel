export interface TumorType {
  id: number;
  name: string;
  systemAffected: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateTumorTypeDto {
  name: string;
  systemAffected: string;
}

export interface UpdateTumorTypeDto {
  name?: string;
  systemAffected?: string;
}

