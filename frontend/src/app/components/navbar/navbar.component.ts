// src/app/components/navbar/navbar.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false; // Initialize to a default value
  private routerSubscription: Subscription | undefined;

  constructor(
    public authService: AuthService, // Made public for potential direct template access if needed, though not used by current template
    private router: Router,
    private cdr: ChangeDetectorRef // For manually triggering change detection if necessary
  ) {
    console.log('NavbarComponent: Constructor called.');
    if (!this.authService) {
      console.error('NavbarComponent: AuthService is NOT injected in constructor!');
    }
  }

  ngOnInit(): void {
    console.log('NavbarComponent: ngOnInit called.');
    this.updateLoginStatusAndDetectChanges(); // Initial check

    // Subscribe to NavigationEnd events to update login status after route changes
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      console.log('NavbarComponent: NavigationEnd event detected.', event);
      this.updateLoginStatusAndDetectChanges();
    });
  }

  updateLoginStatusAndDetectChanges(): void {
    console.log('NavbarComponent: Attempting to update login status...');
    try {
      if (!this.authService) {
        console.error('NavbarComponent: AuthService is not available in updateLoginStatusAndDetectChanges!');
        this.isLoggedIn = false; // Default to false if service is missing
      } else {
        // Call isLoggedIn from the AuthService
        const currentStatus = this.authService.isLoggedIn();
        console.log('NavbarComponent: AuthService.isLoggedIn() returned:', currentStatus);
        this.isLoggedIn = currentStatus;
      }
      console.log('NavbarComponent: isLoggedIn property is now:', this.isLoggedIn);

      // Manually trigger change detection to ensure the view updates
      this.cdr.detectChanges();
    } catch (error) {
      console.error('NavbarComponent: Error during updateLoginStatusAndDetectChanges:', error);
      this.isLoggedIn = false; // Default to false on error to be safe
      this.cdr.detectChanges(); // Still try to update view
    }
  }

  logout(): void {
    console.log('NavbarComponent: logout() called.');
    if (!this.authService) {
        console.error('NavbarComponent: AuthService is not available in logout!');
        // Optionally, still try to navigate
        this.router.navigate(['/login']);
        return;
    }
    this.authService.logout();
    // Update status immediately after logout action
    this.isLoggedIn = false;
    console.log('NavbarComponent: After logout action, isLoggedIn set to false.');
    this.router.navigate(['/login']);
    this.cdr.detectChanges(); // Ensure view updates after logout
  }

  ngOnDestroy(): void {
    console.log('NavbarComponent: ngOnDestroy called.');
    // Unsubscribe from router events to prevent memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      console.log('NavbarComponent: Unsubscribed from router events.');
    }
  }
}
