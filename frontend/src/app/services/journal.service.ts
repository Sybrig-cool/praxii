import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Journal } from '../models/Journal';

@Injectable({ providedIn: 'root' })
export class JournalService {
  private apiUrl = 'http://localhost:8080/api/journal';

  constructor(private http: HttpClient) {}

  addJournal(journal: Journal): Observable<Journal> {
    return this.http.post<Journal>(this.apiUrl, journal);
  }

  getJournals(userId: string): Observable<Journal[]> {
    return this.http.get<Journal[]>(`${this.apiUrl}/user/${userId}`);
  }
}
