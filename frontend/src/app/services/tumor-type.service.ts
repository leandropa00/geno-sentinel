import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TumorType, CreateTumorTypeDto, UpdateTumorTypeDto } from '../models/tumor-type.model';

@Injectable({
  providedIn: 'root'
})
export class TumorTypeService {
  private readonly apiUrl = `${environment.apiUrl}/clinical/tumor-types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TumorType[]> {
    return this.http.get<TumorType[]>(this.apiUrl);
  }

  getById(id: number): Observable<TumorType> {
    return this.http.get<TumorType>(`${this.apiUrl}/${id}`);
  }

  create(tumorType: CreateTumorTypeDto): Observable<TumorType> {
    return this.http.post<TumorType>(this.apiUrl, tumorType);
  }

  update(id: number, tumorType: UpdateTumorTypeDto): Observable<TumorType> {
    return this.http.put<TumorType>(`${this.apiUrl}/${id}`, tumorType);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

