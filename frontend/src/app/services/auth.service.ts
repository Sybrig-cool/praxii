import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Define interfaces for the request and response based on your backend DTOs
interface LoginRequest {
  email: string;
  password: string;
}

// Based on your backend SignupRequest DTO
interface SignupRequest {
  email: string;
  password: string;
  displayName: string;
}

interface AuthResponse {
  token: string | null;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Your backend API URL
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
  }

  signup(signupData: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, signupData).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          console.log('Token stored after signup.');
        }
        // No need to remove token here, as a failed signup shouldn't clear a potentially valid existing session
        // from a different tab, for example. The backend handles if signup is successful.
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    console.log('Token removed on logout.');
    // Here you might also want to navigate the user to the login page
    // or send a request to a backend logout endpoint if you have one.
  }
}