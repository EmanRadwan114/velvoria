import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChanged = new EventEmitter<number>();

  changePage(newPage: number) {
    if (
      newPage >= 1 &&
      newPage <= this.totalPages &&
      newPage !== this.currentPage
    ) {
      this.pageChanged.emit(newPage);
    }
  }
}
