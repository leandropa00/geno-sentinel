import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f5f5;">
      <div class="card" style="width: 400px;">
        <h2 class="card-header" style="text-align: center;">Iniciar Sesión</h2>
        <form (ngSubmit)="onSubmit()">
          <div *ngIf="error" class="alert alert-error">
            {{ error }}
          </div>
          <div class="form-group">
            <label class="form-label">Usuario</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="credentials.username"
              name="username"
              required
              autocomplete="username"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input
              type="password"
              class="form-control"
              [(ngModel)]="credentials.password"
              name="password"
              required
              autocomplete="current-password"
            />
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;" [disabled]="loading">
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };
  error: string | null = null;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.error = null;
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.error = err.error?.error || 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }
}

