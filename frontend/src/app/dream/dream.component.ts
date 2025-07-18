import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DreamService, Dream, DreamRequest, DreamType, DreamStats } from '../dream.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dream',
  templateUrl: './dream.component.html',
  styleUrls: ['./dream.component.scss']
})
export class DreamComponent implements OnInit {
  dreams: Dream[] = [];
  dreamForm: DreamRequest = {
    dreamDate: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    dreamType: DreamType.NORMAL
  };
  
  editingDream: Dream | null = null;
  isEditMode = false;
  loading = false;
  error = '';
  message = '';
  
  dreamTypes = Object.values(DreamType);
  dreamStats: DreamStats | null = null;
  
  filters = {
    dreamType: '',
    startDate: '',
    endDate: '',
    search: ''
  };

  constructor(
    private dreamService: DreamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadDreams();
    this.loadDreamStats();
  }

  checkAuthentication(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'No authentication token found. Please login first.';
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.authService.isTokenValid()) {
      this.error = 'Authentication token has expired. Please login again.';
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }
  }

  loadDreams(): void {
    this.loading = true;
    this.error = '';
    
    const activeFilters = Object.fromEntries(
      Object.entries(this.filters).filter(([_, value]) => value !== '')
    );

    this.dreamService.getAllDreams(activeFilters).subscribe({
      next: (dreams) => {
        this.dreams = dreams;
        this.loading = false;
        if (dreams.length === 0 && Object.keys(activeFilters).length > 0) {
          this.message = 'No dreams found matching your filters.';
        } else {
          this.message = '';
        }
      },
      error: (error) => {
        console.error('Error loading dreams:', error);
        this.loading = false;
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Failed to load dreams. Please try again.';
        }
      }
    });
  }

  loadDreamStats(): void {
    this.dreamService.getDreamStats().subscribe({
      next: (stats) => {
        this.dreamStats = stats;
      },
      error: (error) => {
        console.error('Error loading dream stats:', error);
      }
    });
  }

  onSubmit(): void {
    if (!this.dreamForm.title.trim() || !this.dreamForm.description.trim()) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.message = '';

    const dreamRequest: DreamRequest = {
      dreamDate: this.dreamForm.dreamDate,
      title: this.dreamForm.title.trim(),
      description: this.dreamForm.description.trim(),
      dreamType: this.dreamForm.dreamType
    };

    if (this.isEditMode && this.editingDream) {
      this.dreamService.updateDream(this.editingDream.id!, dreamRequest).subscribe({
        next: (updatedDream) => {
          this.loading = false;
          this.message = 'Dream updated successfully!';
          this.resetForm();
          this.loadDreams();
          this.loadDreamStats();
        },
        error: (error) => {
          console.error('Error updating dream:', error);
          this.loading = false;
          this.error = 'Failed to update dream. Please try again.';
        }
      });
    } else {
      this.dreamService.createDream(dreamRequest).subscribe({
        next: (newDream) => {
          this.loading = false;
          this.message = 'Dream saved successfully!';
          this.resetForm();
          this.loadDreams();
          this.loadDreamStats();
        },
        error: (error) => {
          console.error('Error creating dream:', error);
          this.loading = false;
          this.error = 'Failed to save dream. Please try again.';
        }
      });
    }
  }

  editDream(dream: Dream): void {
    this.editingDream = dream;
    this.isEditMode = true;
    this.dreamForm = {
      dreamDate: dream.dreamDate,
      title: dream.title,
      description: dream.description,
      dreamType: dream.dreamType
    };
    this.error = '';
    this.message = '';
  }

  deleteDream(dream: Dream): void {
    if (confirm(`Are you sure you want to delete the dream "${dream.title}"?`)) {
      this.loading = true;
      this.dreamService.deleteDream(dream.id!).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Dream deleted successfully!';
          this.loadDreams();
          this.loadDreamStats();
        },
        error: (error) => {
          console.error('Error deleting dream:', error);
          this.loading = false;
          this.error = 'Failed to delete dream. Please try again.';
        }
      });
    }
  }

  resetForm(): void {
    this.dreamForm = {
      dreamDate: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      dreamType: DreamType.NORMAL
    };
    this.editingDream = null;
    this.isEditMode = false;
    this.error = '';
    this.message = '';
  }

  clearFilters(): void {
    this.filters = {
      dreamType: '',
      startDate: '',
      endDate: '',
      search: ''
    };
    this.loadDreams();
  }

  applyFilters(): void {
    this.loadDreams();
  }

  getDreamTypeDisplayName(dreamType: DreamType): string {
    return this.dreamService.getDreamTypeDisplayName(dreamType);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  getDreamTypeBadgeColor(dreamType: DreamType): string {
    const colors: { [key in DreamType]: string } = {
      [DreamType.LUCID]: 'success',
      [DreamType.NIGHTMARE]: 'danger',
      [DreamType.RECURRING]: 'warning',
      [DreamType.PROPHETIC]: 'info',
      [DreamType.NORMAL]: 'primary',
      [DreamType.DAYDREAM]: 'light',
      [DreamType.MEDITATION]: 'secondary',
      [DreamType.OTHER]: 'dark'
    };
    return colors[dreamType] || 'primary';
  }

  get maxDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}