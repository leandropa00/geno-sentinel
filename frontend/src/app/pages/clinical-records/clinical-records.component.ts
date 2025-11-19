import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicalRecordService } from '../../services/clinical-record.service';
import { PatientService } from '../../services/patient.service';
import { TumorTypeService } from '../../services/tumor-type.service';
import { ClinicalRecord, CreateClinicalRecordDto, UpdateClinicalRecordDto } from '../../models/clinical-record.model';
import { Patient } from '../../models/patient.model';
import { TumorType } from '../../models/tumor-type.model';

@Component({
  selector: 'app-clinical-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 class="card-header" style="margin: 0;">Gestión de Historias Clínicas</h2>
        <button class="btn btn-primary" (click)="openCreateModal()">Nueva Historia Clínica</button>
      </div>

      <div *ngIf="error" class="alert alert-error">{{ error }}</div>
      <div *ngIf="success" class="alert alert-success">{{ success }}</div>

      <div *ngIf="loading" class="spinner"></div>

      <table *ngIf="!loading" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Paciente</th>
            <th>Tipo de Tumor</th>
            <th>Fecha Diagnóstico</th>
            <th>Etapa</th>
            <th>Protocolo de Tratamiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let record of records">
            <td>{{ record.id.substring(0, 8) }}...</td>
            <td>
              <span *ngIf="record.patient">{{ record.patient.firstName }} {{ record.patient.lastName }}</span>
              <span *ngIf="!record.patient">{{ record.patientId.substring(0, 8) }}...</span>
            </td>
            <td>
              <span *ngIf="record.tumorType">{{ record.tumorType.name }}</span>
              <span *ngIf="!record.tumorType">ID: {{ record.tumorTypeId }}</span>
            </td>
            <td>{{ formatDate(record.diagnosisDate) }}</td>
            <td>{{ record.stage }}</td>
            <td>{{ record.treatmentProtocol }}</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(record)" style="margin-right: 8px;">Editar</button>
              <button class="btn btn-danger" (click)="deleteRecord(record.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && records.length === 0" class="text-center" style="padding: 40px;">
        <p>No hay historias clínicas registradas</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div *ngIf="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div class="card" style="width: 600px; max-height: 90vh; overflow-y: auto;">
        <h3 class="card-header">{{ editingRecord ? 'Editar Historia Clínica' : 'Nueva Historia Clínica' }}</h3>
        <form (ngSubmit)="saveRecord()">
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
            <label class="form-label">Tipo de Tumor *</label>
            <select class="form-control" [(ngModel)]="formData.tumorTypeId" name="tumorTypeId" required>
              <option value="">Seleccione un tipo de tumor...</option>
              <option *ngFor="let tumorType of tumorTypes" [value]="tumorType.id">
                {{ tumorType.name }} - {{ tumorType.systemAffected }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Diagnóstico *</label>
            <input type="date" class="form-control" [(ngModel)]="formData.diagnosisDate" name="diagnosisDate" required />
          </div>
          <div class="form-group">
            <label class="form-label">Etapa *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.stage" name="stage"
                   placeholder="Ej: IIA, IIIB, IV" required />
          </div>
          <div class="form-group">
            <label class="form-label">Protocolo de Tratamiento *</label>
            <textarea class="form-control" [(ngModel)]="formData.treatmentProtocol" name="treatmentProtocol"
                      rows="3" required></textarea>
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
export class ClinicalRecordsComponent implements OnInit {
  records: ClinicalRecord[] = [];
  patients: Patient[] = [];
  tumorTypes: TumorType[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showModal = false;
  editingRecord: ClinicalRecord | null = null;
  saving = false;
  formData: CreateClinicalRecordDto | UpdateClinicalRecordDto = {
    patientId: '',
    tumorTypeId: 0,
    diagnosisDate: '',
    stage: '',
    treatmentProtocol: ''
  };

  constructor(
    private clinicalRecordService: ClinicalRecordService,
    private patientService: PatientService,
    private tumorTypeService: TumorTypeService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadTumorTypes();
    this.loadRecords();
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

  loadTumorTypes(): void {
    this.tumorTypeService.getAll().subscribe({
      next: (tumorTypes) => {
        this.tumorTypes = tumorTypes;
      },
      error: (err) => {
        console.error('Error loading tumor types:', err);
      }
    });
  }

  loadRecords(): void {
    this.loading = true;
    this.error = null;
    this.clinicalRecordService.getAll().subscribe({
      next: (records) => {
        this.records = records;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar historias clínicas: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingRecord = null;
    this.formData = {
      patientId: '',
      tumorTypeId: 0,
      diagnosisDate: '',
      stage: '',
      treatmentProtocol: ''
    };
    this.showModal = true;
  }

  openEditModal(record: ClinicalRecord): void {
    this.editingRecord = record;
    this.formData = {
      patientId: record.patientId,
      tumorTypeId: record.tumorTypeId,
      diagnosisDate: typeof record.diagnosisDate === 'string' ? record.diagnosisDate : new Date(record.diagnosisDate).toISOString().split('T')[0],
      stage: record.stage,
      treatmentProtocol: record.treatmentProtocol
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingRecord = null;
    this.error = null;
    this.success = null;
  }

  saveRecord(): void {
    this.saving = true;
    this.error = null;
    this.success = null;

    if (this.editingRecord) {
      this.clinicalRecordService.update(this.editingRecord.id, this.formData as UpdateClinicalRecordDto).subscribe({
        next: () => {
          this.success = 'Historia clínica actualizada correctamente';
          this.closeModal();
          this.loadRecords();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al actualizar historia clínica: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    } else {
      this.clinicalRecordService.create(this.formData as CreateClinicalRecordDto).subscribe({
        next: () => {
          this.success = 'Historia clínica creada correctamente';
          this.closeModal();
          this.loadRecords();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al crear historia clínica: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    }
  }

  deleteRecord(id: string): void {
    if (confirm('¿Está seguro de eliminar esta historia clínica?')) {
      this.clinicalRecordService.delete(id).subscribe({
        next: () => {
          this.success = 'Historia clínica eliminada correctamente';
          this.loadRecords();
        },
        error: (err) => {
          this.error = 'Error al eliminar historia clínica: ' + (err.error?.message || err.message);
        }
      });
    }
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES');
  }
}

