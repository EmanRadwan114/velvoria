import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-by-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-by-categories.component.html',
  styleUrls: ['./shop-by-categories.component.css'],
})
export class ShopByCategoriesComponent {
  @ViewChild('slider', { static: false }) slider!: ElementRef;

  scrollLeft() {
    this.slider.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.slider.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
