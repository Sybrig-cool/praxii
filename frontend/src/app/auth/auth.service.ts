import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBase}/auth`;

  constructor(private http: HttpClient) {}

  signup(data: { username: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data, { responseType: 'text' });
  }

  login(data: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-email?token=${token}`, { responseType: 'text' });
  }

  resendVerification(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email }, { responseType: 'text' });
  }
}
