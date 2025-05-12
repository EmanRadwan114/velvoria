import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filteration',
  imports: [FormsModule, CommonModule],
  templateUrl: './filteration.component.html',
  styleUrl: './filteration.component.css',
})
export class FilterationComponent {
  materials: string[] = [];
  colors: string[] = [];

  material = 'all';
  color = 'all';
  price = 6000;
  minPrice = 0;
  maxPrice = 30000;

  @Output() filterChanged = new EventEmitter<any>();

  onFilterChange() {
    const filterQuery = {
      material: this.material !== 'all' ? this.material : null,
      color: this.color !== 'all' ? this.color : null,
      price: this.price,
    };
    console.log('Filteration emits:', filterQuery);
    this.filterChanged.emit(filterQuery);
  }
}
