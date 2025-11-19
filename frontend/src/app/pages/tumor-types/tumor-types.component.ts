import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TumorTypeService } from '../../services/tumor-type.service';
import { TumorType, CreateTumorTypeDto, UpdateTumorTypeDto } from '../../models/tumor-type.model';

@Component({
  selector: 'app-tumor-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 class="card-header" style="margin: 0;">Gestión de Tipos de Tumor</h2>
        <button class="btn btn-primary" (click)="openCreateModal()">Nuevo Tipo de Tumor</button>
      </div>

      <div *ngIf="error" class="alert alert-error">{{ error }}</div>
      <div *ngIf="success" class="alert alert-success">{{ success }}</div>

      <div *ngIf="loading" class="spinner"></div>

      <table *ngIf="!loading" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Sistema Afectado</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let tumorType of tumorTypes">
            <td>{{ tumorType.id }}</td>
            <td>{{ tumorType.name }}</td>
            <td>{{ tumorType.systemAffected }}</td>
            <td>{{ formatDate(tumorType.createdAt) }}</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(tumorType)" style="margin-right: 8px;">Editar</button>
              <button class="btn btn-danger" (click)="deleteTumorType(tumorType.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && tumorTypes.length === 0" class="text-center" style="padding: 40px;">
        <p>No hay tipos de tumor registrados</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div *ngIf="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div class="card" style="width: 500px; max-height: 90vh; overflow-y: auto;">
        <h3 class="card-header">{{ editingTumorType ? 'Editar Tipo de Tumor' : 'Nuevo Tipo de Tumor' }}</h3>
        <form (ngSubmit)="saveTumorType()">
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.name" name="name" required />
          </div>
          <div class="form-group">
            <label class="form-label">Sistema Afectado *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.systemAffected" name="systemAffected" required />
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
export class TumorTypesComponent implements OnInit {
  tumorTypes: TumorType[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showModal = false;
  editingTumorType: TumorType | null = null;
  saving = false;
  formData: CreateTumorTypeDto | UpdateTumorTypeDto = {
    name: '',
    systemAffected: ''
  };

  constructor(private tumorTypeService: TumorTypeService) {}

  ngOnInit(): void {
    this.loadTumorTypes();
  }

  loadTumorTypes(): void {
    this.loading = true;
    this.error = null;
    this.tumorTypeService.getAll().subscribe({
      next: (tumorTypes) => {
        this.tumorTypes = tumorTypes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar tipos de tumor: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingTumorType = null;
    this.formData = {
      name: '',
      systemAffected: ''
    };
    this.showModal = true;
  }

  openEditModal(tumorType: TumorType): void {
    this.editingTumorType = tumorType;
    this.formData = {
      name: tumorType.name,
      systemAffected: tumorType.systemAffected
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingTumorType = null;
    this.error = null;
    this.success = null;
  }

  saveTumorType(): void {
    this.saving = true;
    this.error = null;
    this.success = null;

    if (this.editingTumorType) {
      this.tumorTypeService.update(this.editingTumorType.id, this.formData as UpdateTumorTypeDto).subscribe({
        next: () => {
          this.success = 'Tipo de tumor actualizado correctamente';
          this.closeModal();
          this.loadTumorTypes();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al actualizar tipo de tumor: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    } else {
      this.tumorTypeService.create(this.formData as CreateTumorTypeDto).subscribe({
        next: () => {
          this.success = 'Tipo de tumor creado correctamente';
          this.closeModal();
          this.loadTumorTypes();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al crear tipo de tumor: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    }
  }

  deleteTumorType(id: number): void {
    if (confirm('¿Está seguro de eliminar este tipo de tumor?')) {
      this.tumorTypeService.delete(id).subscribe({
        next: () => {
          this.success = 'Tipo de tumor eliminado correctamente';
          this.loadTumorTypes();
        },
        error: (err) => {
          this.error = 'Error al eliminar tipo de tumor: ' + (err.error?.message || err.message);
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

