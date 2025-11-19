export interface PatientVariantReport {
  id: string;
  patientId: string;
  variantId: string;
  detectionDate: string | Date;
  alleleFrequency: number; // VAF (Variant Allele Frequency) as decimal
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Optional: populated when fetching with related data
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  variant?: {
    id: string;
    chromosome: string;
    position: number;
    referenceBase: string;
    alternateBase: string;
    impact: string;
    gene?: {
      id: string;
      symbol: string;
    };
  };
}

export interface CreatePatientVariantReportDto {
  patientId: string;
  variantId: string;
  detectionDate: string;
  alleleFrequency: number;
}

export interface UpdatePatientVariantReportDto {
  patientId?: string;
  variantId?: string;
  detectionDate?: string;
  alleleFrequency?: number;
}

