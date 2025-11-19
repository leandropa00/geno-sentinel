import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./pages/patients/patients.component').then(m => m.PatientsComponent)
      },
      {
        path: 'tumor-types',
        loadComponent: () => import('./pages/tumor-types/tumor-types.component').then(m => m.TumorTypesComponent)
      },
      {
        path: 'clinical-records',
        loadComponent: () => import('./pages/clinical-records/clinical-records.component').then(m => m.ClinicalRecordsComponent)
      },
      {
        path: 'genes',
        loadComponent: () => import('./pages/genes/genes.component').then(m => m.GenesComponent)
      },
      {
        path: 'genetic-variants',
        loadComponent: () => import('./pages/genetic-variants/genetic-variants.component').then(m => m.GeneticVariantsComponent)
      },
      {
        path: 'patient-variant-reports',
        loadComponent: () => import('./pages/patient-variant-reports/patient-variant-reports.component').then(m => m.PatientVariantReportsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

