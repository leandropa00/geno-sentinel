export interface Gene {
  id: string;
  symbol: string;
  fullName: string;
  functionSummary: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateGeneDto {
  symbol: string;
  fullName: string;
  functionSummary: string;
}

export interface UpdateGeneDto {
  symbol?: string;
  fullName?: string;
  functionSummary?: string;
}

