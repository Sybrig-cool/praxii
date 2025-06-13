import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private healthUrl = `${environment.apiBase}/health`; // Adjust if backend runs on another host/port

  constructor(private http: HttpClient) {}

  getHealth(): Observable<string> {
    return this.http.get(this.healthUrl, { responseType: 'text' });
  }
}
