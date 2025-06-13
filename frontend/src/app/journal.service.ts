import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Journal {
  id: string;
  content: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = 'http://localhost:8080/api/journal';

  constructor(private http: HttpClient) {}

  getJournals(): Observable<Journal[]> {
    return this.http.get<Journal[]>(this.apiUrl);
  }

  createJournal(content: string): Observable<any> {
    return this.http.post(this.apiUrl, { content }, { responseType: 'text' });
  }
}
