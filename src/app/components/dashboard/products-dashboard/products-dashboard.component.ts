import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-dashboard',
  imports: [CommonModule],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.css',
})
export class ProductsDashboardComponent implements OnInit {
  private readonly _ProductsServices = inject(ProductsService);
  productsList: any[] = [];

  ngOnInit(): void {
    this.fetchAllProducts();
  }
  fetchAllProducts() {
    this._ProductsServices.getAllProducts().subscribe({
      next: (res: any) => {
        this.productsList = res.data;
        console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
