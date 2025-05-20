import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { HomeProductCardComponent } from '../home-product-card/home-product-card.component';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-home-products',
  imports: [
    CommonModule,
    FormsModule,
    HomeProductCardComponent,
    LoadingSPinnerComponent,
  ],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css',
})
export class HomeProductsComponent implements OnInit {
  isLoading = false;
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
    this.isLoading = true;
    this.prdServices.getProductByLabel(this.activeTab).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.filteredList = [...this.products];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  onTabChange(tab: string): void {
    this.isLoading = true;
    this.activeTab = tab;

    this.prdServices.getProductByLabel(this.activeTab).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.filteredList = [...this.products];
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  viewAllBtn(): void {
    this.router.navigate(['/furniture']);
  }
}
