import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Journal {
  id: string;
  content: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = `${environment.apiBase}/journal`;

  constructor(private http: HttpClient) {}

  getJournals(): Observable<Journal[]> {
    return this.http.get<Journal[]>(this.apiUrl);
  }

  createJournal(content: string): Observable<any> {
    return this.http.post(this.apiUrl, { content }, { responseType: 'text' });
  }
}
