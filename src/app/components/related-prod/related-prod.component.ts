import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-related-prod',
  templateUrl: './related-prod.component.html',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
})
export class RelatedProdComponent implements OnInit {
  products: any[] = [];

  constructor(private prdServices: ProductsService) {}

  ngOnInit(): void {
    this.prdServices.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.data;
      },
      error: (err) => console.log(err),
    });
  }

  currentIndex = 0;
  cardsPerView = 4;

  getTransform(): string {
    const offset = this.currentIndex * 290; // 250px card + 2*20px margin
    return `translateX(-${offset}px)`;
  }

  scrollRight() {
    const total = this.products.length;
    this.currentIndex = (this.currentIndex + this.cardsPerView) % total;
  }

  scrollLeft() {
    const total = this.products.length;
    this.currentIndex = (this.currentIndex - this.cardsPerView + total) % total;
  }
}
