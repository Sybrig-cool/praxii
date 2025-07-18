import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Dream {
  id?: string;
  dreamDate: string;
  title: string;
  description: string;
  dreamType: DreamType;
  dreamTypeDisplayName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DreamRequest {
  dreamDate: string;
  title: string;
  description: string;
  dreamType: DreamType;
}

export enum DreamType {
  LUCID = 'LUCID',
  NIGHTMARE = 'NIGHTMARE',
  RECURRING = 'RECURRING',
  PROPHETIC = 'PROPHETIC',
  NORMAL = 'NORMAL',
  DAYDREAM = 'DAYDREAM',
  MEDITATION = 'MEDITATION',
  OTHER = 'OTHER'
}

export interface DreamStats {
  totalDreams: number;
}

@Injectable({
  providedIn: 'root'
})
export class DreamService {
  private apiUrl = `${environment.apiBase}/dreams`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createDream(dream: DreamRequest): Observable<Dream> {
    return this.http.post<Dream>(this.apiUrl, dream, { headers: this.getHeaders() });
  }

  getAllDreams(filters?: {
    dreamType?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Observable<Dream[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.dreamType) params = params.set('dreamType', filters.dreamType);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
      if (filters.search) params = params.set('search', filters.search);
    }
    
    return this.http.get<Dream[]>(this.apiUrl, { 
      headers: this.getHeaders(),
      params: params
    });
  }

  getDreamById(id: string): Observable<Dream> {
    return this.http.get<Dream>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateDream(id: string, dream: DreamRequest): Observable<Dream> {
    return this.http.put<Dream>(`${this.apiUrl}/${id}`, dream, { headers: this.getHeaders() });
  }

  deleteDream(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getDreamTypes(): Observable<DreamType[]> {
    return this.http.get<DreamType[]>(`${this.apiUrl}/types`, { headers: this.getHeaders() });
  }

  getDreamStats(): Observable<DreamStats> {
    return this.http.get<DreamStats>(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  getDreamTypeDisplayName(dreamType: DreamType): string {
    const displayNames: { [key in DreamType]: string } = {
      [DreamType.LUCID]: 'Lucid Dream',
      [DreamType.NIGHTMARE]: 'Nightmare',
      [DreamType.RECURRING]: 'Recurring Dream',
      [DreamType.PROPHETIC]: 'Prophetic Dream',
      [DreamType.NORMAL]: 'Normal Dream',
      [DreamType.DAYDREAM]: 'Daydream',
      [DreamType.MEDITATION]: 'Meditation Vision',
      [DreamType.OTHER]: 'Other'
    };
    return displayNames[dreamType] || dreamType.toString();
  }
}