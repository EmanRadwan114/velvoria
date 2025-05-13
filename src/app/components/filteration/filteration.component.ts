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
    'Rattan',
    'Metal',
    'Fabric',
    'Glass',
    'Plastic',
  ];
  colors: string[] = [
    'White',
    'Beige ',
    'Brown',
    'Gray',
    'Black',
    'Blue',
    'Green',
    'Red',
    'Pink',
    'Teal',
  ];

  material = 'all';
  color = 'all';
  minPrice: number = 200;
  maxPrice: number = 20000;


  price: number = this.maxPrice;

  @Output() filterChanged = new EventEmitter<any>();

  onFilterChange() {
    const filterQuery = {
      material: this.material !== 'all' ? this.material.toLowerCase() : null,
      color: this.color !== 'all' ? this.color.toLowerCase() : null,
      price: this.price,
    };
    console.log('Filteration emits:', filterQuery);
    this.filterChanged.emit(filterQuery);
  }
}
