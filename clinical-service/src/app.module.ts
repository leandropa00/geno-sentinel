import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule, ApplicationModule, PresentationModule],
})
export class AppModule {}

