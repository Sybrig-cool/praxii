import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JournalService, Journal } from '../journal.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html'
})
export class JournalComponent implements OnInit {
  journals: Journal[] = [];
  content = '';
  loading = false;
  error = '';
  message = '';

  constructor(
    private journalService: JournalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'No authentication token found. Please login first.';
      console.error('No JWT token found in localStorage');
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.authService.isTokenValid()) {
      this.error = 'Authentication token has expired. Please login again.';
      console.error('JWT token is expired or invalid');
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('JWT token found and valid, loading journals...');
    this.loadJournals();
  }

  loadJournals(): void {
    this.error = '';
    this.journalService.getJournals().subscribe({
      next: res => this.journals = res,
      error: (err) => {
        this.journals = [];
        console.error('Journal loading error:', err);
        
        if (err.status === 0) {
          this.error = 'Failed to load journals: Cannot connect to server. Please check if you are logged in.';
        } else if (err.status === 401) {
          this.error = 'Failed to load journals: Authentication failed. Please login again.';
        } else if (err.status === 403) {
          this.error = 'Failed to load journals: Access denied. Please login again.';
        } else {
          this.error = 'Failed to load journals: ' + (err.error || err.message || `Error ${err.status}`);
        }
      }
    });
  }

  create(): void {
    if (!this.content.trim()) {
      return;
    }
    
    // Check if user is still authenticated
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'No authentication token found. Please login first.';
      console.error('No JWT token found when trying to create journal');
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.authService.isTokenValid()) {
      this.error = 'Authentication token has expired. Please login again.';
      console.error('JWT token is expired or invalid when trying to create journal');
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('Creating journal with token present...');
    this.loading = true;
    this.error = '';
    this.message = '';
    this.journalService.createJournal(this.content).subscribe({
      next: () => {
        this.content = '';
        this.loading = false;
        this.message = 'Journal entry created successfully!';
        this.loadJournals();
      },
      error: (err) => {
        this.loading = false;
        console.error('Journal creation error:', err);
        
        if (err.status === 0) {
          this.error = 'Failed to create journal: Cannot connect to server. Please check if you are logged in.';
        } else if (err.status === 401) {
          this.error = 'Failed to create journal: Authentication failed. Please login again.';
        } else if (err.status === 403) {
          this.error = 'Failed to create journal: Access denied. Please login again.';
        } else {
          this.error = 'Failed to create journal: ' + (err.error || err.message || `Error ${err.status}`);
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
