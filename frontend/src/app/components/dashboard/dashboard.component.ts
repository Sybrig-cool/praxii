import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

       constructor(
private authService: AuthService,
private router: Router
) {}

   logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to login page after logout
    console.log('User logged out');
  }
}
