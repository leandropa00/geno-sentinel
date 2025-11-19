import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PatientVariantReport, CreatePatientVariantReportDto, UpdatePatientVariantReportDto } from '../models/patient-variant-report.model';

@Injectable({
  providedIn: 'root'
})
export class PatientVariantReportService {
  private readonly apiUrl = `${environment.apiUrl}/genomic/patient-variant-reports`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PatientVariantReport[]> {
    return this.http.get<PatientVariantReport[]>(this.apiUrl);
  }

  getById(id: string): Observable<PatientVariantReport> {
    return this.http.get<PatientVariantReport>(`${this.apiUrl}/${id}`);
  }

  getByPatientId(patientId: string): Observable<PatientVariantReport[]> {
    return this.http.get<PatientVariantReport[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getByVariantId(variantId: string): Observable<PatientVariantReport[]> {
    return this.http.get<PatientVariantReport[]>(`${this.apiUrl}/variant/${variantId}`);
  }

  create(report: CreatePatientVariantReportDto): Observable<PatientVariantReport> {
    return this.http.post<PatientVariantReport>(this.apiUrl, report);
  }

  update(id: string, report: UpdatePatientVariantReportDto): Observable<PatientVariantReport> {
    return this.http.put<PatientVariantReport>(`${this.apiUrl}/${id}`, report);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

