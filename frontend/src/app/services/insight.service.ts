import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsightRequest, InsightResponse } from '../models/InsightRequest';

@Injectable({ providedIn: 'root' })
export class InsightService {
  private apiUrl = 'http://localhost:8080/api/insight';

  constructor(private http: HttpClient) {}

  getInsight(data: InsightRequest): Observable<InsightResponse> {
    return this.http.post<InsightResponse>(this.apiUrl, data);
  }
}
