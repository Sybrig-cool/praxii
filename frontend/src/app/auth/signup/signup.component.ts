import { Component } from '@angular/core';
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

  constructor(private authService: AuthService) {}

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
        this.message = 'Signup successful! Please log in.';
        this.loading = false;
      },
      error: err => {
        this.error = err.error || 'Signup failed.';
        this.loading = false;
      }
    });
  }
}
