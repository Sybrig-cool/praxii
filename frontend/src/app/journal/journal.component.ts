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

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.loadJournals();
  }

  loadJournals(): void {
    this.journalService.getJournals().subscribe({
      next: res => this.journals = res,
      error: () => this.journals = []
    });
  }

  create(): void {
    if (!this.content.trim()) {
      return;
    }
    this.loading = true;
    this.journalService.createJournal(this.content).subscribe({
      next: () => {
        this.content = '';
        this.loading = false;
        this.loadJournals();
      },
      error: () => this.loading = false
    });
  }
}
