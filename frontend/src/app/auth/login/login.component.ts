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
    this.loading = true;
    this.error = '';
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.loading = false;
        // Optionally navigate to dashboard or home after login
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error || 'Login failed.';
        this.loading = false;
      }
    });
  }
}
