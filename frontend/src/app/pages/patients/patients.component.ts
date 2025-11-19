import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient, CreatePatientDto, UpdatePatientDto, Gender, PatientStatus } from '../../models/patient.model';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 class="card-header" style="margin: 0;">Gestión de Pacientes</h2>
        <button class="btn btn-primary" (click)="openCreateModal()">Nuevo Paciente</button>
      </div>

      <div *ngIf="error" class="alert alert-error">{{ error }}</div>
      <div *ngIf="success" class="alert alert-success">{{ success }}</div>

      <div *ngIf="loading" class="spinner"></div>

      <table *ngIf="!loading" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha de Nacimiento</th>
            <th>Género</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let patient of patients">
            <td>{{ patient.id.substring(0, 8) }}...</td>
            <td>{{ patient.firstName }}</td>
            <td>{{ patient.lastName }}</td>
            <td>{{ formatDate(patient.birthDate) }}</td>
            <td>{{ getGenderLabel(patient.gender) }}</td>
            <td>{{ patient.status }}</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(patient)" style="margin-right: 8px;">Editar</button>
              <button class="btn btn-danger" (click)="deactivatePatient(patient.id)" *ngIf="patient.status !== PatientStatus.INACTIVO">Desactivar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && patients.length === 0" class="text-center" style="padding: 40px;">
        <p>No hay pacientes registrados</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div *ngIf="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div class="card" style="width: 500px; max-height: 90vh; overflow-y: auto;">
        <h3 class="card-header">{{ editingPatient ? 'Editar Paciente' : 'Nuevo Paciente' }}</h3>
        <form (ngSubmit)="savePatient()">
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.firstName" name="firstName" required />
          </div>
          <div class="form-group">
            <label class="form-label">Apellido *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.lastName" name="lastName" required />
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Nacimiento *</label>
            <input type="date" class="form-control" [(ngModel)]="formData.birthDate" name="birthDate" required />
          </div>
          <div class="form-group">
            <label class="form-label">Género *</label>
            <select class="form-control" [(ngModel)]="formData.gender" name="gender" required>
              <option value="">Seleccione...</option>
              <option [value]="Gender.MALE">Masculino</option>
              <option [value]="Gender.FEMALE">Femenino</option>
              <option [value]="Gender.OTHER">Otro</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Estado</label>
            <select class="form-control" [(ngModel)]="formData.status" name="status">
              <option [value]="PatientStatus.ACTIVO">Activo</option>
              <option [value]="PatientStatus.SEGUIMIENTO">Seguimiento</option>
              <option [value]="PatientStatus.INACTIVO">Inactivo</option>
            </select>
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
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showModal = false;
  editingPatient: Patient | null = null;
  saving = false;
  formData: CreatePatientDto | UpdatePatientDto = {
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: Gender.MALE,
    status: PatientStatus.ACTIVO
  };

  Gender = Gender;
  PatientStatus = PatientStatus;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.error = null;
    this.patientService.getAll().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar pacientes: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingPatient = null;
    this.formData = {
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: Gender.MALE,
      status: PatientStatus.ACTIVO
    };
    this.showModal = true;
  }

  openEditModal(patient: Patient): void {
    this.editingPatient = patient;
    this.formData = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      birthDate: typeof patient.birthDate === 'string' ? patient.birthDate : patient.birthDate.toISOString().split('T')[0],
      gender: patient.gender,
      status: patient.status
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingPatient = null;
    this.error = null;
    this.success = null;
  }

  savePatient(): void {
    this.saving = true;
    this.error = null;
    this.success = null;

    if (this.editingPatient) {
      this.patientService.update(this.editingPatient.id, this.formData as UpdatePatientDto).subscribe({
        next: () => {
          this.success = 'Paciente actualizado correctamente';
          this.closeModal();
          this.loadPatients();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al actualizar paciente: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    } else {
      this.patientService.create(this.formData as CreatePatientDto).subscribe({
        next: () => {
          this.success = 'Paciente creado correctamente';
          this.closeModal();
          this.loadPatients();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al crear paciente: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    }
  }

  deactivatePatient(id: string): void {
    if (confirm('¿Está seguro de desactivar este paciente?')) {
      this.patientService.deactivate(id).subscribe({
        next: () => {
          this.success = 'Paciente desactivado correctamente';
          this.loadPatients();
        },
        error: (err) => {
          this.error = 'Error al desactivar paciente: ' + (err.error?.message || err.message);
        }
      });
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES');
  }

  getGenderLabel(gender: Gender): string {
    const labels: Record<Gender, string> = {
      [Gender.MALE]: 'Masculino',
      [Gender.FEMALE]: 'Femenino',
      [Gender.OTHER]: 'Otro'
    };
    return labels[gender] || gender;
  }
}

