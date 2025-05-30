    // src/app/components/signup/signup.component.ts
    import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup, Validators } from '@angular/forms';
    import { Router } from '@angular/router';
    import { AuthService } from '../../services/auth.service'; // Adjust path as needed

    @Component({
      selector: 'app-signup',
      templateUrl: './signup.component.html',
      styleUrls: ['./signup.component.scss'] // Or .scss
    })
    export class SignupComponent implements OnInit {
      signupForm!: FormGroup;
      signupError: string | null = null;
      signupSuccessMessage: string | null = null;
      isLoading = false;

      constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
      ) { }

      ngOnInit(): void {
        this.signupForm = this.fb.group({
          displayName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]] // Example: min length
        });
      }

      onSubmit(): void {
        if (this.signupForm.invalid) {
          this.signupForm.markAllAsTouched();
          return;
        }

        this.isLoading = true;
        this.signupError = null;
        this.signupSuccessMessage = null;

        const { displayName, email, password } = this.signupForm.value;

        this.authService.signup({ displayName, email, password }).subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Signup successful', response);
            this.signupSuccessMessage = response.message || 'Signup successful! You can now log in.';

            // Optionally, navigate to login or dashboard if token is received
            if (response.token) {
              // If backend auto-logs in and returns token, navigate to dashboard
              this.router.navigate(['/dashboard']);
            } else {
              // If backend requires separate login after signup
              // this.router.navigate(['/login']); // Or just show success message
              // For now, let's clear the form and show success
              this.signupForm.reset();
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Signup failed', err);
            this.signupError = err.error?.message || 'Signup failed. Please try again.';
          }
        });
      }
    }
    