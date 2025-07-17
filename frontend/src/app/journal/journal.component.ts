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
    this.loadJournals();
  }

  loadJournals(): void {
    this.error = '';
    this.journalService.getJournals().subscribe({
      next: res => this.journals = res,
      error: (err) => {
        this.journals = [];
        this.error = 'Failed to load journals: ' + (err.error || err.message || 'Unknown error');
        console.error('Journal loading error:', err);
      }
    });
  }

  create(): void {
    if (!this.content.trim()) {
      return;
    }
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
        this.error = 'Failed to create journal: ' + (err.error || err.message || 'Unknown error');
        console.error('Journal creation error:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
