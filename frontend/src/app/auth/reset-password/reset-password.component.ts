import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  message = '';
  showNewPassword = false;
  showConfirmPassword = false;
  
  passwordStrength = {
    score: 0,
    isValid: false,
    errors: [] as string[]
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Get token from query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.error = 'Invalid reset link. Please request a new password reset.';
      }
    });
  }

  onNewPasswordChange(): void {
    if (this.newPassword) {
      const validation = this.authService.validatePasswordStrength(this.newPassword);
      this.passwordStrength.isValid = validation.isValid;
      this.passwordStrength.errors = validation.errors;
      this.passwordStrength.score = this.authService.getPasswordStrengthScore(this.newPassword);
    } else {
      this.passwordStrength = { score: 0, isValid: false, errors: [] };
    }
  }

  onSubmit(): void {
    this.error = '';
    this.message = '';

    // Validation
    if (!this.token) {
      this.error = 'Invalid reset token. Please request a new password reset.';
      return;
    }

    if (!this.newPassword.trim()) {
      this.error = 'New password is required.';
      return;
    }

    if (!this.confirmPassword.trim()) {
      this.error = 'Password confirmation is required.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    if (!this.passwordStrength.isValid) {
      this.error = 'Please ensure your password meets all requirements.';
      return;
    }

    this.loading = true;

    const resetData = {
      token: this.token,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };

    this.authService.resetPassword(resetData).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = response || 'Password reset successfully. You can now log in with your new password.';
        
        // Redirect to login after a delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        this.loading = false;
        
        if (error.status === 400) {
          this.error = error.error || 'Invalid or expired reset token. Please request a new password reset.';
        } else {
          this.error = 'An error occurred while resetting your password. Please try again.';
        }
      }
    });
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  getStrengthBarClass(): string {
    switch (this.passwordStrength.score) {
      case 0:
      case 1: return 'strength-very-weak';
      case 2: return 'strength-weak';
      case 3: return 'strength-fair';
      case 4: return 'strength-good';
      case 5: return 'strength-strong';
      default: return 'strength-very-weak';
    }
  }

  getStrengthText(): string {
    switch (this.passwordStrength.score) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return 'Very Weak';
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}