import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { HomeProductCardComponent } from '../home-product-card/home-product-card.component';

@Component({
  selector: 'app-home-products',
  imports: [
    CommonModule,
    ProductCardComponent,
    FormsModule,
    HomeProductCardComponent,
  ],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css',
})
export class HomeProductsComponent implements OnInit {
  constructor(private router: Router, private prdServices: ProductsService) {}

  ////! there is no 'SALE' label so i removed it temp

  tabs = [
    { key: 'hot', label: 'HOT' },
    { key: 'new arrival', label: 'ARRIVALS' },
    { key: 'trendy', label: 'TRENDING' },
    // { key: 'hot', label: 'SALE OFF' },
  ];

  activeTab: string = 'hot';

  products: object[] = [];
  filteredList: object[] = [];

  ngOnInit(): void {
    this.prdServices.getProductByLabel(this.activeTab).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.filteredList = [...this.products];
      },
      error: (err: any) => console.log(err),
    });
  }

  onTabChange(tab: string): void {
    this.activeTab = tab;

    this.prdServices.getProductByLabel(this.activeTab).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.filteredList = [...this.products];
      },
      error: (err) => console.log(err),
    });
  }

  viewAllBtn(): void {
    this.router.navigate(['/furnitures']);
  }
}
