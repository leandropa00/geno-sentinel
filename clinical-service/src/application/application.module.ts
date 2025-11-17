import { Module } from '@nestjs/common';
import { PatientUseCases } from './use-cases/patient.use-cases';
import { TumorTypeUseCases } from './use-cases/tumor-type.use-cases';
import { ClinicalRecordUseCases } from './use-cases/clinical-record.use-cases';
import { PersistenceModule } from '@infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [PatientUseCases, TumorTypeUseCases, ClinicalRecordUseCases],
  exports: [PatientUseCases, TumorTypeUseCases, ClinicalRecordUseCases],
})
export class ApplicationModule {}

