import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgressSummary } from '../models/ProgressSummary';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private apiUrl = 'http://localhost:8080/api/progress';

  constructor(private http: HttpClient) {}

  getProgress(userId: string): Observable<ProgressSummary> {
    return this.http.get<ProgressSummary>(`${this.apiUrl}/user/${userId}`);
  }
}
