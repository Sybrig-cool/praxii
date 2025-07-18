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
  showVerificationMessage = false;
  userEmail = '';

  loading = false;
  resendLoading = false;

  constructor(private authService: AuthService, public router: Router) {}

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
        this.loading = false;
        this.showVerificationMessage = true;
        this.userEmail = this.email;
        this.message = res;
      },
      error: err => {
        this.error = err.error || 'Signup failed.';
        this.loading = false;
      }
    });
  }

  resendVerification() {
    this.resendLoading = true;
    this.message = '';
    this.error = '';
    
    this.authService.resendVerification(this.userEmail).subscribe({
      next: res => {
        this.resendLoading = false;
        this.message = res;
      },
      error: err => {
        this.resendLoading = false;
        this.error = err.error || 'Failed to resend verification email.';
      }
    });
  }
}
