import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-pagination.component.html',
  styleUrl: './dashboard-pagination.component.css',
})
export class DashboardPaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  get totalPagesArray(): (number | string)[] {
    const pages: (number | string)[] = [];

    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, '...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(
          1,
          '...',
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages
        );
      } else {
        pages.push(1, '...', this.currentPage, '...', this.totalPages);
      }
    }

    return pages;
  }
}
