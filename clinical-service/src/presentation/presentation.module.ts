import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient.controller';
import { TumorTypeController } from './controllers/tumor-type.controller';
import { ClinicalRecordController } from './controllers/clinical-record.controller';
import { ApplicationModule } from '@application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [
    PatientController,
    TumorTypeController,
    ClinicalRecordController,
  ],
})
export class PresentationModule {}

