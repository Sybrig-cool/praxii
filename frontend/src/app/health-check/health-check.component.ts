import { Component, OnInit } from '@angular/core';
import { HealthCheckService } from '../health-check.service';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {
  status: string = 'Checking...';

  constructor(private healthService: HealthCheckService) {}

  ngOnInit(): void {
    this.healthService.getHealth().subscribe({
      next: (result: string) => this.status = result,
      error: () => this.status = 'ERROR'
    });
  }
}
