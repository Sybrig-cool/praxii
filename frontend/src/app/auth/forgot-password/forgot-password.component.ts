import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  loading = false;
  error = '';
  message = '';
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.email.trim()) {
      this.error = 'Please enter your email address.';
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.submitted = true;
        this.message = response || 'If an account with this email exists, you will receive a password reset link shortly.';
      },
      error: (error) => {
        console.error('Error requesting password reset:', error);
        this.loading = false;
        this.submitted = true;
        // Always show success message for security (don't reveal if email exists)
        this.message = 'If an account with this email exists, you will receive a password reset link shortly.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  resendRequest(): void {
    this.submitted = false;
    this.message = '';
    this.error = '';
  }
}