import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">Geno Sentinel</div>
        <div class="navbar-menu">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Dashboard</a>

          <div class="nav-dropdown" [class.active]="isClinicalActive()">
            <a class="nav-dropdown-toggle" (click)="toggleDropdown('clinical')">
              Clínica
              <span class="dropdown-arrow">▼</span>
            </a>
            <div class="nav-dropdown-menu" *ngIf="activeDropdown === 'clinical'">
              <a routerLink="/patients" routerLinkActive="active" (click)="closeDropdown()">Pacientes</a>
              <a routerLink="/tumor-types" routerLinkActive="active" (click)="closeDropdown()">Tipos de Tumor</a>
              <a routerLink="/clinical-records" routerLinkActive="active" (click)="closeDropdown()">Historias Clínicas</a>
            </div>
          </div>

          <div class="nav-dropdown" [class.active]="isGenomicActive()">
            <a class="nav-dropdown-toggle" (click)="toggleDropdown('genomic')">
              Genómica
              <span class="dropdown-arrow">▼</span>
            </a>
            <div class="nav-dropdown-menu" *ngIf="activeDropdown === 'genomic'">
              <a routerLink="/genes" routerLinkActive="active" (click)="closeDropdown()">Genes</a>
              <a routerLink="/genetic-variants" routerLinkActive="active" (click)="closeDropdown()">Variantes Genéticas</a>
              <a routerLink="/patient-variant-reports" routerLinkActive="active" (click)="closeDropdown()">Reportes de Variantes</a>
            </div>
          </div>

          <div class="navbar-user">
            <span style="margin-right: 16px;">{{ authService.getUsername() }}</span>
            <a (click)="logout()" style="cursor: pointer;">Cerrar Sesión</a>
          </div>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class LayoutComponent {
  activeDropdown: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleDropdown(dropdown: string): void {
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

  isClinicalActive(): boolean {
    return this.router.url.includes('/patients') ||
           this.router.url.includes('/tumor-types') ||
           this.router.url.includes('/clinical-records');
  }

  isGenomicActive(): boolean {
    return this.router.url.includes('/genes') ||
           this.router.url.includes('/genetic-variants') ||
           this.router.url.includes('/patient-variant-reports');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

