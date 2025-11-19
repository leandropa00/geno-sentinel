import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneticVariantService } from '../../services/genetic-variant.service';
import { GeneService } from '../../services/gene.service';
import { GeneticVariant, CreateGeneticVariantDto, UpdateGeneticVariantDto, VariantImpact } from '../../models/genetic-variant.model';
import { Gene } from '../../models/gene.model';

@Component({
  selector: 'app-genetic-variants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 class="card-header" style="margin: 0;">Gestión de Variantes Genéticas</h2>
        <button class="btn btn-primary" (click)="openCreateModal()">Nueva Variante</button>
      </div>

      <div *ngIf="error" class="alert alert-error">{{ error }}</div>
      <div *ngIf="success" class="alert alert-success">{{ success }}</div>

      <div *ngIf="loading" class="spinner"></div>

      <table *ngIf="!loading" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Gen</th>
            <th>Cromosoma</th>
            <th>Posición</th>
            <th>Referencia</th>
            <th>Alternativa</th>
            <th>Impacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let variant of variants">
            <td>{{ variant.id.substring(0, 8) }}...</td>
            <td>
              <span *ngIf="variant.gene">{{ variant.gene.symbol }}</span>
              <span *ngIf="!variant.gene">{{ variant.geneId.substring(0, 8) }}...</span>
            </td>
            <td>{{ variant.chromosome }}</td>
            <td>{{ variant.position }}</td>
            <td>{{ variant.referenceBase }}</td>
            <td>{{ variant.alternateBase }}</td>
            <td>{{ variant.impact }}</td>
            <td>
              <button class="btn btn-secondary" (click)="openEditModal(variant)" style="margin-right: 8px;">Editar</button>
              <button class="btn btn-danger" (click)="deleteVariant(variant.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && variants.length === 0" class="text-center" style="padding: 40px;">
        <p>No hay variantes genéticas registradas</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div *ngIf="showModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
      <div class="card" style="width: 500px; max-height: 90vh; overflow-y: auto;">
        <h3 class="card-header">{{ editingVariant ? 'Editar Variante Genética' : 'Nueva Variante Genética' }}</h3>
        <form (ngSubmit)="saveVariant()">
          <div class="form-group">
            <label class="form-label">Gen *</label>
            <select class="form-control" [(ngModel)]="formData.geneId" name="geneId" required>
              <option value="">Seleccione un gen...</option>
              <option *ngFor="let gene of genes" [value]="gene.id">{{ gene.symbol }} - {{ gene.fullName }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Cromosoma (ej: chr17) *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.chromosome" name="chromosome" required />
          </div>
          <div class="form-group">
            <label class="form-label">Posición *</label>
            <input type="number" class="form-control" [(ngModel)]="formData.position" name="position" required />
          </div>
          <div class="form-group">
            <label class="form-label">Base de Referencia (ej: A) *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.referenceBase" name="referenceBase" maxlength="1" required />
          </div>
          <div class="form-group">
            <label class="form-label">Base Alternativa (ej: G) *</label>
            <input type="text" class="form-control" [(ngModel)]="formData.alternateBase" name="alternateBase" maxlength="1" required />
          </div>
          <div class="form-group">
            <label class="form-label">Impacto *</label>
            <select class="form-control" [(ngModel)]="formData.impact" name="impact" required>
              <option value="">Seleccione...</option>
              <option [value]="VariantImpact.MISSENSE">Missense</option>
              <option [value]="VariantImpact.FRAMESHIFT">Frameshift</option>
              <option [value]="VariantImpact.NONSENSE">Nonsense</option>
              <option [value]="VariantImpact.SILENT">Silent</option>
              <option [value]="VariantImpact.SYNONYMOUS">Synonymous</option>
              <option [value]="VariantImpact.NON_SYNONYMOUS">Non-synonymous</option>
              <option [value]="VariantImpact.SPLICE_SITE">Splice Site</option>
              <option [value]="VariantImpact.INTRONIC">Intronic</option>
              <option [value]="VariantImpact.UTR">UTR</option>
              <option [value]="VariantImpact.OTHER">Other</option>
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
export class GeneticVariantsComponent implements OnInit {
  variants: GeneticVariant[] = [];
  genes: Gene[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showModal = false;
  editingVariant: GeneticVariant | null = null;
  saving = false;
  formData: CreateGeneticVariantDto | UpdateGeneticVariantDto = {
    geneId: '',
    chromosome: '',
    position: 0,
    referenceBase: '',
    alternateBase: '',
    impact: VariantImpact.MISSENSE
  };

  VariantImpact = VariantImpact;

  constructor(
    private geneticVariantService: GeneticVariantService,
    private geneService: GeneService
  ) {}

  ngOnInit(): void {
    this.loadGenes();
    this.loadVariants();
  }

  loadGenes(): void {
    this.geneService.getAll().subscribe({
      next: (genes) => {
        this.genes = genes;
      },
      error: (err) => {
        console.error('Error loading genes:', err);
      }
    });
  }

  loadVariants(): void {
    this.loading = true;
    this.error = null;
    this.geneticVariantService.getAll().subscribe({
      next: (variants) => {
        this.variants = variants;
        // Load gene details for each variant
        variants.forEach(variant => {
          if (variant.geneId && !variant.gene) {
            this.geneService.getById(variant.geneId).subscribe({
              next: (gene) => {
                variant.gene = gene;
              },
              error: () => {
                // Silently fail if gene not found
              }
            });
          }
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar variantes: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingVariant = null;
    this.formData = {
      geneId: '',
      chromosome: '',
      position: 0,
      referenceBase: '',
      alternateBase: '',
      impact: VariantImpact.MISSENSE
    };
    this.showModal = true;
  }

  openEditModal(variant: GeneticVariant): void {
    this.editingVariant = variant;
    this.formData = {
      geneId: variant.geneId,
      chromosome: variant.chromosome,
      position: variant.position,
      referenceBase: variant.referenceBase,
      alternateBase: variant.alternateBase,
      impact: variant.impact
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingVariant = null;
    this.error = null;
    this.success = null;
  }

  saveVariant(): void {
    this.saving = true;
    this.error = null;
    this.success = null;

    if (this.editingVariant) {
      this.geneticVariantService.update(this.editingVariant.id, this.formData as UpdateGeneticVariantDto).subscribe({
        next: () => {
          this.success = 'Variante actualizada correctamente';
          this.closeModal();
          this.loadVariants();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al actualizar variante: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    } else {
      this.geneticVariantService.create(this.formData as CreateGeneticVariantDto).subscribe({
        next: () => {
          this.success = 'Variante creada correctamente';
          this.closeModal();
          this.loadVariants();
          this.saving = false;
        },
        error: (err) => {
          this.error = 'Error al crear variante: ' + (err.error?.message || err.message);
          this.saving = false;
        }
      });
    }
  }

  deleteVariant(id: string): void {
    if (confirm('¿Está seguro de eliminar esta variante genética?')) {
      this.geneticVariantService.delete(id).subscribe({
        next: () => {
          this.success = 'Variante eliminada correctamente';
          this.loadVariants();
        },
        error: (err) => {
          this.error = 'Error al eliminar variante: ' + (err.error?.message || err.message);
        }
      });
    }
  }
}

