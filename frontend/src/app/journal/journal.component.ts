import { Component, OnInit } from '@angular/core';
import { JournalService, Journal } from '../journal.service';

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
    private journalService: JournalService
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
      this.error = 'Please enter some content for your journal entry.';
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
    
    console.log('Creating journal with content:', this.content);
    console.log('Token present:', !!token);
    this.loading = true;
    this.error = '';
    this.message = '';
    
    this.journalService.createJournal(this.content).subscribe({
      next: (response) => {
        console.log('Journal creation response:', response);
        this.content = '';
        this.loading = false;
        this.message = 'Journal entry created successfully!';
        this.loadJournals();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          this.message = '';
        }, 5000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Journal creation error:', err);
        console.error('Error status:', err.status);
        console.error('Error body:', err.error);
        
        if (err.status === 0) {
          this.error = 'Failed to create journal: Cannot connect to server. Please check your connection and try again.';
        } else if (err.status === 401) {
          this.error = 'Failed to create journal: Authentication failed. Please login again.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.error = 'Failed to create journal: Access denied. Please login again.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          const errorMessage = err.error?.message || err.message || `HTTP Error ${err.status}`;
          this.error = 'Failed to create journal: ' + errorMessage;
        }
      }
    });
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getCurrentMonth(): number {
    return new Date().getMonth() + 1;
  }

  getRecentMonths(): Array<{year: number, month: number, name: string}> {
    const months = [];
    const now = new Date();
    
    for (let i = 1; i <= 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        name: monthNames[date.getMonth()]
      });
    }
    
    return months;
  }
}
