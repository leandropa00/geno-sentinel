import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient, CreatePatientDto, UpdatePatientDto, PatientStatus } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly apiUrl = `${environment.apiUrl}/clinical/patients`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  getByStatus(status: PatientStatus): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/status/${status}`);
  }

  create(patient: CreatePatientDto): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  update(id: string, patient: UpdatePatientDto): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  deactivate(id: string): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}

