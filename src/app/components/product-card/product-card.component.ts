import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() thumbnail: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() price: string = '';

  hovered = 0;

  // it is optional for description
  
  // desMaxLength: number = 50;

  // get truncatedDescription(): string {
  //   return this.description.length > this.desMaxLength
  //     ? this.description.slice(0, this.desMaxLength) + '....'
  //     : this.description;
  // }

  // get showSeeMore(): boolean {
  //   return this.description.length > this.desMaxLength; // true
  // }
}
