import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService, Journal } from '../../journal.service';

@Component({
  selector: 'app-journal-archive',
  templateUrl: './journal-archive.component.html',
  styleUrls: ['./journal-archive.component.scss']
})
export class JournalArchiveComponent implements OnInit {
  
  journals: Journal[] = [];
  loading = false;
  error = '';
  currentMonth = '';
  currentYear = 0;
  monthName = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private journalService: JournalService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const year = parseInt(params['year']);
      const month = parseInt(params['month']);
      
      if (year && month) {
        this.currentYear = year;
        this.currentMonth = month.toString().padStart(2, '0');
        this.monthName = this.getMonthName(month);
        this.loadArchiveEntries(year, month);
      } else {
        this.error = 'Invalid date parameters';
      }
    });
  }

  loadArchiveEntries(year: number, month: number): void {
    this.loading = true;
    this.error = '';
    
    this.journalService.getJournalsByDate(year, month).subscribe({
      next: (response: Journal[]) => {
        this.journals = response;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load journal entries';
        this.loading = false;
      }
    });
  }

  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }

  goToPreviousMonth(): void {
    let newMonth = parseInt(this.currentMonth) - 1;
    let newYear = this.currentYear;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    this.router.navigate(['/archive'], { 
      queryParams: { year: newYear, month: newMonth } 
    });
  }

  goToNextMonth(): void {
    let newMonth = parseInt(this.currentMonth) + 1;
    let newYear = this.currentYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    
    this.router.navigate(['/archive'], { 
      queryParams: { year: newYear, month: newMonth } 
    });
  }

  getTotalWords(): number {
    return this.journals.reduce((total, journal) => {
      return total + journal.content.split(' ').length;
    }, 0);
  }

  getAverageWords(): number {
    if (this.journals.length === 0) return 0;
    return Math.round(this.getTotalWords() / this.journals.length);
  }

}
