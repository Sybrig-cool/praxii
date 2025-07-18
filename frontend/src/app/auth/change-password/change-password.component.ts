import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PasswordChangeRequest } from '../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: PasswordChangeRequest = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  loading = false;
  error = '';
  message = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  passwordStrength = {
    score: 0,
    isValid: false,
    errors: [] as string[]
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'No authentication token found. Please login first.';
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.authService.isTokenValid()) {
      this.error = 'Authentication token has expired. Please login again.';
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }
  }

  onNewPasswordChange(): void {
    if (this.passwordForm.newPassword) {
      const validation = this.authService.validatePasswordStrength(this.passwordForm.newPassword);
      this.passwordStrength.isValid = validation.isValid;
      this.passwordStrength.errors = validation.errors;
      this.passwordStrength.score = this.authService.getPasswordStrengthScore(this.passwordForm.newPassword);
    } else {
      this.passwordStrength = { score: 0, isValid: false, errors: [] };
    }
  }

  onSubmit(): void {
    this.error = '';
    this.message = '';

    // Basic validation
    if (!this.passwordForm.currentPassword.trim()) {
      this.error = 'Current password is required.';
      return;
    }

    if (!this.passwordForm.newPassword.trim()) {
      this.error = 'New password is required.';
      return;
    }

    if (!this.passwordForm.confirmPassword.trim()) {
      this.error = 'Password confirmation is required.';
      return;
    }

    // Check if passwords match
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.error = 'New password and confirmation do not match.';
      return;
    }

    // Check if new password is different from current
    if (this.passwordForm.currentPassword === this.passwordForm.newPassword) {
      this.error = 'New password must be different from current password.';
      return;
    }

    // Validate password strength
    if (!this.passwordStrength.isValid) {
      this.error = 'Please ensure your new password meets all requirements.';
      return;
    }

    this.loading = true;

    this.authService.changePassword(this.passwordForm).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = 'Password changed successfully!';
        this.resetForm();
        
        // Optionally redirect after a delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.loading = false;
        
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 400) {
          this.error = error.error || 'Failed to change password. Please check your current password.';
        } else {
          this.error = 'An error occurred while changing password. Please try again.';
        }
      }
    });
  }

  resetForm(): void {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.passwordStrength = { score: 0, isValid: false, errors: [] };
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
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
}