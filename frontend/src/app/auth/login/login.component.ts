import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password.';
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    console.log('Attempting login for:', this.email);
    
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        this.authService.saveToken(res.token);
        this.loading = false;
        console.log('Token saved, navigating to dashboard...');
        // Navigate to the dashboard after a successful login
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.loading = false;
        
        if (err.status === 0) {
          this.error = 'Cannot connect to server. Please check your connection and try again.';
        } else if (err.status === 401 || err.status === 403) {
          this.error = 'Invalid email or password. Please try again.';
        } else {
          this.error = err.error || 'Login failed. Please try again.';
        }
      }
    });
  }
}
