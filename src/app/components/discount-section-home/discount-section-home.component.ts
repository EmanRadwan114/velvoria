import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-discount-section-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './discount-section-home.component.html',
  styleUrl: './discount-section-home.component.css',
})
export class DiscountSectionHomeComponent implements OnInit {
  constructor(private ProductService: ProductsService) {}
  ngOnInit(): void {
    this.getDiscountProducts();
  }
  discountProducts: any[] = [];
  getDiscountProducts() {
    this.ProductService.discountProducts().subscribe({
      next: (res: any) => {
        this.discountProducts = res.data || res;
      },
      error: (err: any) => {
        console.error('Error fetching discount products', err);
      },
    });
  }
  formattedPrice: string = '';
  formatPrice(price: number): string {
    return price.toLocaleString('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getDiscountPercentage(price: number): string {
    if (price > 0) {
      const discountedPrice = price * (1 - 0.2); // apply 35% discount
      return new Intl.NumberFormat('en-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,

        maximumFractionDigits: 0,
      }).format(discountedPrice);
    }
    return 'EGP 0';
  }
}
