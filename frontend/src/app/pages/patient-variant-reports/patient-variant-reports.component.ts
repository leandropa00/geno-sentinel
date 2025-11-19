import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientVariantReportService } from '../../services/patient-variant-report.service';
import { PatientService } from '../../services/patient.service';
import { GeneticVariantService } from '../../services/genetic-variant.service';
import { PatientVariantReport, CreatePatientVariantReportDto, UpdatePatientVariantReportDto } from '../../models/patient-variant-report.model';
import { Patient } from '../../models/patient.model';
import { GeneticVariant } from '../../models/genetic-variant.model';

@Component({
  selector: 'app-patient-variant-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 class="card-header" style="margin: 0;">Gestión de Reportes de Variantes del Paciente</h2>
        <button class="btn btn-primary" (click)="openCreateModal()">Nuevo Reporte</button>
      </div>

      <div *ngIf="error" class="alert alert-error">{{ error }}</div>
      <div *ngIf="success" class="alert alert-success">{{ success }}</div>

      <div *ngIf="loading" class="spinner"></div>

      <table *ngIf="!loading" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Variante</th>
            <th>Gen</th>
            <th>Fecha de Detección</th>
            <th>Frecuencia Alélica (VAF)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let report of reports">
            <td>{{ report.id.substring(0, 8) }}...</td>
            <td>
              <span *ngIf="report.patient">{{ report.patient.firstName }} {{ report.patient.lastName }}</span>
              <span *ngIf="!report.patient">{{ report.patientId.substring(0, 8) }}...</span>
            </td>
            <td>
              <span *ngIf="report.variant">
                {{ report.variant.chromosome }}:{{ report.variant.position }} {{ report.variant.referenceBase }}>{{ report.variant.alternateBase }}
              </span>
              <span *ngIf="!report.variant">{{ report.variantId.substring(0, 8) }}...</span>
            </td>
            <td>
              <span *ngIf="report.variant?.gene">{{ report.variant?.gene?.symbol }}</span>
            </td>
            <td>{{ formatDate(report.detectionDate) }}</td>
            <td>{{ (report.alleleFrequency * 100).toFixed(2) }}%</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(report)" style="margin-right: 8px;">Editar</button>
              <button class="btn btn-danger" (click)="deleteReport(report.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && reports.length === 0" class="text-center" style="padding: 40px;">
        <p>No hay reportes de variantes registrados</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div *ngIf="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div class="card" style="width: 500px; max-height: 90vh; overflow-y: auto;">
        <h3 class="card-header">{{ editingReport ? 'Editar Reporte' : 'Nuevo Reporte' }}</h3>
        <form (ngSubmit)="saveReport()">
          <div class="form-group">
            <label class="form-label">Paciente *</label>
            <select class="form-control" [(ngModel)]="formData.patientId" name="patientId" required>
              <option value="">Seleccione un paciente...</option>
              <option *ngFor="let patient of patients" [value]="patient.id">
                {{ patient.firstName }} {{ patient.lastName }} ({{ patient.id.substring(0, 8) }}...)
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Variante Genética *</label>
            <select class="form-control" [(ngModel)]="formData.variantId" name="variantId" required>
              <option value="">Seleccione una variante...</option>
              <option *ngFor="let variant of variants" [value]="variant.id">
                {{ variant.chromosome }}:{{ variant.position }} {{ variant.referenceBase }}>{{ variant.alternateBase }}
                <span *ngIf="variant.gene"> ({{ variant.gene.symbol }})</span>
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Detección *</label>
            <input type="date" class="form-control" [(ngModel)]="formData.detectionDate" name="detectionDate" required />
          </div>
          <div class="form-group">
            <label class="form-label">Frecuencia Alélica (VAF) *</label>
            <input type="number" class="form-control" [(ngModel)]="formData.alleleFrequency" name="alleleFrequency"
                   step="0.0001" min="0" max="1" required />
            <small style="color: #666;">Valor entre 0 y 1 (ej: 0.25 = 25%)</small>
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px;">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="saving">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PatientVariantReportsComponent implements OnInit {
  reports: PatientVariantReport[] = [];
  patients: Patient[] = [];
  variants: GeneticVariant[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showModal = false;
  editingReport: PatientVariantReport | null = null;
  saving = false;
  formData: CreatePatientVariantReportDto | UpdatePatientVariantReportDto = {
    patientId: '',
    variantId: '',
    detectionDate: '',
    alleleFrequency: 0
  };

  constructor(
    private patientVariantReportService: PatientVariantReportService,
    private patientService: PatientService,
    private geneticVariantService: GeneticVariantService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadVariants();
    this.loadReports();
  }

  loadPatients(): void {
    this.patientService.getAll().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
      }
    });
  }

  loadVariants(): void {
    this.geneticVariantService.getAll().subscribe({
      next: (variants) => {
        this.variants = variants;
        // Load gene details for each variant
        variants.forEach(variant => {
          if (variant.geneId && !variant.gene) {
            this.geneticVariantService.getById(variant.id).subscribe({
              next: (fullVariant) => {
                variant.gene = fullVariant.gene;
              },
              error: () => {
                // Silently fail
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Error loading variants:', err);
      }
    });
  }

  loadReports(): void {
    this.loading = true;
    this.error = null;
    this.patientVariantReportService.getAll().subscribe({
      next: (reports) => {
        this.reports = reports;
        // Load patient and variant details
        reports.forEach(report => {
          if (report.patientId && !report.patient) {
            this.patientService.getById(report.patientId).subscribe({
              next: (patient) => {
                report.patient = patient;
              },
              error: () => {
                // Silently fail
              }
            });
          }
          if (report.variantId && !report.variant) {
            this.geneticVariantService.getById(report.variantId).subscribe({
              next: (variant) => {
                report.variant = variant;
              },
              error: () => {
                // Silently fail
              }
            });
          }
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar reportes: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingReport = null;
    this.formData = {
      patientId: '',
      variantId: '',
      detectionDate: new Date().toISOString().split('T')[0],
      alleleFrequency: 0
    };
    this.showModal = true;
  }

  openEditModal(report: PatientVariantReport): void {
    this.editingReport = report;
    const detectionDate = typeof report.detectionDate === 'string'
      ? report.detectionDate
      : new Date(report.detectionDate).toISOString().split('T')[0];

    this.formData = {
      patientId: report.patientId,
      variantId: report.variantId,
      detectionDate: detectionDate,
      alleleFrequency: report.alleleFrequency
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingReport = null;
    this.error = null;
    this.success = null;
  }

  saveReport(): void {
    this.saving = true;
    this.error = null;
    this.success = null;

    if (this.editingReport) {
      this.patientVariantReportService.update(this.editingReport.id, this.formData as UpdatePatientVariantReportDto).subscribe({
        next: () => {
          this.success = 'Reporte actualizado correctamente';
          this.closeModal();
          this.loadReports();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al actualizar reporte: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    } else {
      this.patientVariantReportService.create(this.formData as CreatePatientVariantReportDto).subscribe({
        next: () => {
          this.success = 'Reporte creado correctamente';
          this.closeModal();
          this.loadReports();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al crear reporte: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    }
  }

  deleteReport(id: string): void {
    if (confirm('¿Está seguro de eliminar este reporte?')) {
      this.patientVariantReportService.delete(id).subscribe({
        next: () => {
          this.success = 'Reporte eliminado correctamente';
          this.loadReports();
        },
        error: (err) => {
          this.error = 'Error al eliminar reporte: ' + (err.error?.message || err.message);
        }
      });
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES');
  }
}

