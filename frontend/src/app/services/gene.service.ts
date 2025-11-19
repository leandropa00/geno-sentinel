import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Gene, CreateGeneDto, UpdateGeneDto } from '../models/gene.model';

@Injectable({
  providedIn: 'root'
})
export class GeneService {
  private readonly apiUrl = `${environment.apiUrl}/genomic/genes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Gene[]> {
    return this.http.get<Gene[]>(this.apiUrl);
  }

  getById(id: string): Observable<Gene> {
    return this.http.get<Gene>(`${this.apiUrl}/${id}`);
  }

  create(gene: CreateGeneDto): Observable<Gene> {
    return this.http.post<Gene>(this.apiUrl, gene);
  }

  update(id: string, gene: UpdateGeneDto): Observable<Gene> {
    return this.http.put<Gene>(`${this.apiUrl}/${id}`, gene);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

