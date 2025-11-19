import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { TumorTypeService } from '../../services/tumor-type.service';
import { ClinicalRecordService } from '../../services/clinical-record.service';
import { GeneService } from '../../services/gene.service';
import { GeneticVariantService } from '../../services/genetic-variant.service';
import { PatientVariantReportService } from '../../services/patient-variant-report.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card">
      <h2 class="card-header">Dashboard</h2>

      <h3 style="margin-top: 32px; margin-bottom: 16px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px;">Microservicio Clínico</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 24px;">
        <div class="card" style="text-align: center;">
          <h3 style="font-size: 32px; margin-bottom: 8px; color: #007bff;">{{ patientsCount }}</h3>
          <p style="color: #666;">Pacientes</p>
          <a routerLink="/patients" class="btn btn-primary" style="margin-top: 16px; display: inline-block;">Ver Pacientes</a>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="font-size: 32px; margin-bottom: 8px; color: #17a2b8;">{{ tumorTypesCount }}</h3>
          <p style="color: #666;">Tipos de Tumor</p>
          <a routerLink="/tumor-types" class="btn btn-secondary" style="margin-top: 16px; display: inline-block; background-color: #17a2b8; border-color: #17a2b8;">Ver Tipos de Tumor</a>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="font-size: 32px; margin-bottom: 8px; color: #6f42c1;">{{ clinicalRecordsCount }}</h3>
          <p style="color: #666;">Historias Clínicas</p>
          <a routerLink="/clinical-records" class="btn btn-secondary" style="margin-top: 16px; display: inline-block; background-color: #6f42c1; border-color: #6f42c1;">Ver Historias Clínicas</a>
        </div>
      </div>

      <h3 style="margin-top: 48px; margin-bottom: 16px; color: #333; border-bottom: 2px solid #28a745; padding-bottom: 8px;">Microservicio Genómico</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-top: 24px;">
        <div class="card" style="text-align: center;">
          <h3 style="font-size: 32px; margin-bottom: 8px; color: #28a745;">{{ genesCount }}</h3>
          <p style="color: #666;">Genes</p>
          <a routerLink="/genes" class="btn btn-success" style="margin-top: 16px; display: inline-block;">Ver Genes</a>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="font-size: 32px; margin-bottom: 8px; color: #ffc107;">{{ variantsCount }}</h3>
          <p style="color: #666;">Variantes Genéticas</p>
          <a routerLink="/genetic-variants" class="btn btn-secondary" style="margin-top: 16px; display: inline-block; background-color: #ffc107; border-color: #ffc107; color: #333;">Ver Variantes</a>
        </div>
        <div class="card" style="text-align: center;">
          <h3 style="font-size: 32px; margin-bottom: 8px; color: #dc3545;">{{ reportsCount }}</h3>
          <p style="color: #666;">Reportes de Variantes</p>
          <a routerLink="/patient-variant-reports" class="btn btn-danger" style="margin-top: 16px; display: inline-block;">Ver Reportes</a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  patientsCount = 0;
  tumorTypesCount = 0;
  clinicalRecordsCount = 0;
  genesCount = 0;
  variantsCount = 0;
  reportsCount = 0;

  constructor(
    private patientService: PatientService,
    private tumorTypeService: TumorTypeService,
    private clinicalRecordService: ClinicalRecordService,
    private geneService: GeneService,
    private geneticVariantService: GeneticVariantService,
    private patientVariantReportService: PatientVariantReportService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {
    // Microservicio Clínico
    this.patientService.getAll().subscribe({
      next: (patients) => this.patientsCount = patients.length,
      error: () => this.patientsCount = 0
    });

    this.tumorTypeService.getAll().subscribe({
      next: (tumorTypes) => this.tumorTypesCount = tumorTypes.length,
      error: () => this.tumorTypesCount = 0
    });

    this.clinicalRecordService.getAll().subscribe({
      next: (records) => this.clinicalRecordsCount = records.length,
      error: () => this.clinicalRecordsCount = 0
    });

    // Microservicio Genómico
    this.geneService.getAll().subscribe({
      next: (genes) => this.genesCount = genes.length,
      error: () => this.genesCount = 0
    });

    this.geneticVariantService.getAll().subscribe({
      next: (variants) => this.variantsCount = variants.length,
      error: () => this.variantsCount = 0
    });

    this.patientVariantReportService.getAll().subscribe({
      next: (reports) => this.reportsCount = reports.length,
      error: () => this.reportsCount = 0
    });
  }
}

