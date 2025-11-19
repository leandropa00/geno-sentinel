import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClinicalRecord, CreateClinicalRecordDto, UpdateClinicalRecordDto } from '../models/clinical-record.model';

@Injectable({
  providedIn: 'root'
})
export class ClinicalRecordService {
  private readonly apiUrl = `${environment.apiUrl}/clinical/clinical-records`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClinicalRecord[]> {
    return this.http.get<ClinicalRecord[]>(this.apiUrl);
  }

  getById(id: string): Observable<ClinicalRecord> {
    return this.http.get<ClinicalRecord>(`${this.apiUrl}/${id}`);
  }

  getByPatientId(patientId: string): Observable<ClinicalRecord[]> {
    return this.http.get<ClinicalRecord[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  create(clinicalRecord: CreateClinicalRecordDto): Observable<ClinicalRecord> {
    return this.http.post<ClinicalRecord>(this.apiUrl, clinicalRecord);
  }

  update(id: string, clinicalRecord: UpdateClinicalRecordDto): Observable<ClinicalRecord> {
    return this.http.put<ClinicalRecord>(`${this.apiUrl}/${id}`, clinicalRecord);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

