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
