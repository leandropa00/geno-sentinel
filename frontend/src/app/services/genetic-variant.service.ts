import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeneticVariant, CreateGeneticVariantDto, UpdateGeneticVariantDto } from '../models/genetic-variant.model';

@Injectable({
  providedIn: 'root'
})
export class GeneticVariantService {
  private readonly apiUrl = `${environment.apiUrl}/genomic/genetic-variants`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<GeneticVariant[]> {
    return this.http.get<GeneticVariant[]>(this.apiUrl);
  }

  getById(id: string): Observable<GeneticVariant> {
    return this.http.get<GeneticVariant>(`${this.apiUrl}/${id}`);
  }

  getByGeneId(geneId: string): Observable<GeneticVariant[]> {
    return this.http.get<GeneticVariant[]>(`${this.apiUrl}/gene/${geneId}`);
  }

  create(variant: CreateGeneticVariantDto): Observable<GeneticVariant> {
    return this.http.post<GeneticVariant>(this.apiUrl, variant);
  }

  update(id: string, variant: UpdateGeneticVariantDto): Observable<GeneticVariant> {
    return this.http.put<GeneticVariant>(`${this.apiUrl}/${id}`, variant);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

