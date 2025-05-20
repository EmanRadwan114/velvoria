import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filteration',
  imports: [FormsModule, CommonModule],
  templateUrl: './filteration.component.html',
  styleUrl: './filteration.component.css',
})
export class FilterationComponent {
  materials: string[] = [
    'All',
    'Wood',
    'Leather',
    'Metal',
    'Fabric',
    'Glass',
    'Plastic',
    'Ceramic',
  ];
  colors: string[] = [
    'White',
    'Brown',
    'Gray',
    'Black',
    'Blue',
    'Navy',
    'Green',
    'Yellow',
    'Orange',
    'Red',
    'Pink',
  ];

  material = 'all';
  color = 'all';
  minPrice: number = 200;
  maxPrice: number = 20000;

  price: number = this.maxPrice;

  @Output() filterChanged = new EventEmitter<any>();
  onFilterChange() {
    const filterQuery: any = {};

    if (this.material !== 'all') {
      filterQuery.material = this.material.toLowerCase();
    }

    if (this.color !== 'all') {
      filterQuery.color = this.color.toLowerCase();
    }

    if (this.price) {
      filterQuery.price = this.price;
    }

    console.log('Filteration emits:', filterQuery);
    this.filterChanged.emit(filterQuery);
  }
}
