export enum VariantImpact {
  MISSENSE = 'Missense',
  FRAMESHIFT = 'Frameshift',
  NONSENSE = 'Nonsense',
  SILENT = 'Silent',
  SYNONYMOUS = 'Synonymous',
  NON_SYNONYMOUS = 'Non-synonymous',
  SPLICE_SITE = 'Splice Site',
  INTRONIC = 'Intronic',
  UTR = 'UTR',
  OTHER = 'Other'
}

export interface GeneticVariant {
  id: string;
  geneId: string;
  chromosome: string;
  position: number;
  referenceBase: string;
  alternateBase: string;
  impact: VariantImpact;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Optional: populated when fetching with gene details
  gene?: {
    id: string;
    symbol: string;
    fullName: string;
  };
}

export interface CreateGeneticVariantDto {
  geneId: string;
  chromosome: string;
  position: number;
  referenceBase: string;
  alternateBase: string;
  impact: VariantImpact;
}

export interface UpdateGeneticVariantDto {
  geneId?: string;
  chromosome?: string;
  position?: number;
  referenceBase?: string;
  alternateBase?: string;
  impact?: VariantImpact;
}

