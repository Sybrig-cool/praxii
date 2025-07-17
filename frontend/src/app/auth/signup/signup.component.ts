import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  message = '';
  error = '';

  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.message = '';
    this.error = '';
    this.authService.signup({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: res => {
        this.message = 'Signup successful! Redirecting to login...';
        this.loading = false;
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        this.error = err.error || 'Signup failed.';
        this.loading = false;
      }
    });
  }
}
