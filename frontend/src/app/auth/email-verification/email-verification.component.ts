import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {
  
  loading = false;
  message = '';
  error = '';
  isVerified = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.verifyEmail(token);
    } else {
      this.error = 'Invalid verification link';
    }
  }

  verifyEmail(token: string): void {
    this.loading = true;
    this.authService.verifyEmail(token).subscribe(
      response => {
        this.loading = false;
        this.isVerified = true;
        this.message = response;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error => {
        this.loading = false;
        this.error = error.error || 'Verification failed';
      }
    );
  }

}
