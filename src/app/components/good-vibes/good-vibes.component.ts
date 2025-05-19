import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from './../../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-good-vibes',
  imports: [CommonModule],
  templateUrl: './good-vibes.component.html',
  styleUrl: './good-vibes.component.css',
})
export class GoodVibesComponent implements OnInit {
  showCard1 = false;
  showCard2 = false;
  showCard3 = false;

  products!: { thumbnail: string; title: string; price: number; _id: string ; images:string[];}[];

  constructor(
    private productService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProductByLabel('trendy').subscribe({
      next: (data: any) => {
        this.products = data.data;
      },
    });
  }

  getProductByID(id: string) {
    this.productService.getSpecificProduct(id).subscribe({
      next: () => {
        this.router.navigate([`/furnitures/${id}`]);
      },
    });
  }
}
