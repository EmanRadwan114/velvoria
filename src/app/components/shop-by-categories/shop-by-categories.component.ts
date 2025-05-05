import { RouterLink } from '@angular/router';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-by-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-by-categories.component.html',
  styleUrls: ['./shop-by-categories.component.css'],
})
export class ShopByCategoriesComponent {
  //@ViewChild() is a decorator that gives you direct access to a DOM element
  @ViewChild('slider', { static: false }) slider!: ElementRef;

  scrollLeft() {
    const sliderEl = this.slider.nativeElement;

    if (sliderEl.scrollLeft <= 0) {
      // Jump to the end
      const maxScrollLeft = sliderEl.scrollWidth - sliderEl.clientWidth;
      sliderEl.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
    } else {
      sliderEl.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight() {
    const sliderEl = this.slider.nativeElement;
    const maxScrollLeft = sliderEl.scrollWidth - sliderEl.clientWidth;

    if (sliderEl.scrollLeft >= maxScrollLeft) {
      // If we're at the end, go back to start
      sliderEl.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      sliderEl.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}
