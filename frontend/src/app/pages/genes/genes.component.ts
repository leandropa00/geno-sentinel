import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneService } from '../../services/gene.service';
import { Gene, CreateGeneDto, UpdateGeneDto } from '../../models/gene.model';

@Component({
  selector: 'app-genes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 class="card-header" style="margin: 0;">Gestión de Genes</h2>
        <button class="btn btn-primary" (click)="openCreateModal()">Nuevo Gen</button>
      </div>

      <div *ngIf="error" class="alert alert-error">{{ error }}</div>
      <div *ngIf="success" class="alert alert-success">{{ success }}</div>

      <div *ngIf="loading" class="spinner"></div>

      <table *ngIf="!loading" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Símbolo</th>
            <th>Nombre Completo</th>
            <th>Resumen de Función</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let gene of genes">
            <td>{{ gene.id.substring(0, 8) }}...</td>
            <td><strong>{{ gene.symbol }}</strong></td>
            <td>{{ gene.fullName }}</td>
            <td>{{ gene.functionSummary }}</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(gene)" style="margin-right: 8px;">Editar</button>
              <button class="btn btn-danger" (click)="deleteGene(gene.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && genes.length === 0" class="text-center" style="padding: 40px;">
        <p>No hay genes registrados</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div *ngIf="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div class="card" style="width: 500px; max-height: 90vh; overflow-y: auto;">
        <h3 class="card-header">{{ editingGene ? 'Editar Gen' : 'Nuevo Gen' }}</h3>
        <form (ngSubmit)="saveGene()">
          <div class="form-group">
            <label class="form-label">Símbolo (ej: BRCA1) *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.symbol" name="symbol" required />
          </div>
          <div class="form-group">
            <label class="form-label">Nombre Completo *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.fullName" name="fullName" required />
          </div>
          <div class="form-group">
            <label class="form-label">Resumen de Función *</label>
            <textarea class="form-control" [(ngModel)]="formData.functionSummary" name="functionSummary" rows="4" required></textarea>
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
export class GenesComponent implements OnInit {
  genes: Gene[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showModal = false;
  editingGene: Gene | null = null;
  saving = false;
  formData: CreateGeneDto | UpdateGeneDto = {
    symbol: '',
    fullName: '',
    functionSummary: ''
  };

  constructor(private geneService: GeneService) {}

  ngOnInit(): void {
    this.loadGenes();
  }

  loadGenes(): void {
    this.loading = true;
    this.error = null;
    this.geneService.getAll().subscribe({
      next: (genes) => {
        this.genes = genes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar genes: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingGene = null;
    this.formData = {
      symbol: '',
      fullName: '',
      functionSummary: ''
    };
    this.showModal = true;
  }

  openEditModal(gene: Gene): void {
    this.editingGene = gene;
    this.formData = {
      symbol: gene.symbol,
      fullName: gene.fullName,
      functionSummary: gene.functionSummary
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingGene = null;
    this.error = null;
    this.success = null;
  }

  saveGene(): void {
    this.saving = true;
    this.error = null;
    this.success = null;

    if (this.editingGene) {
      this.geneService.update(this.editingGene.id, this.formData as UpdateGeneDto).subscribe({
        next: () => {
          this.success = 'Gen actualizado correctamente';
          this.closeModal();
          this.loadGenes();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al actualizar gen: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    } else {
      this.geneService.create(this.formData as CreateGeneDto).subscribe({
        next: () => {
          this.success = 'Gen creado correctamente';
          this.closeModal();
          this.loadGenes();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al crear gen: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    }
  }

  deleteGene(id: string): void {
    if (confirm('¿Está seguro de eliminar este gen?')) {
      this.geneService.delete(id).subscribe({
        next: () => {
          this.success = 'Gen eliminado correctamente';
          this.loadGenes();
        },
        error: (err) => {
          this.error = 'Error al eliminar gen: ' + (err.error?.message || err.message);
        }
      });
    }
  }
}

