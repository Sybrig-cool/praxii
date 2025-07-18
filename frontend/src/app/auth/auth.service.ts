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

  saveUserInfo(username: string, email: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Basic JWT structure check
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < exp;
    } catch (e) {
      console.error('Invalid JWT token format:', e);
      return false;
    }
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-email?token=${token}`, { responseType: 'text' });
  }

  resendVerification(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email }, { responseType: 'text' });
  }
}
