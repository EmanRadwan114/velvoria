import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../../../services/products.service';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../../services/categories.service';

@Component({
  selector: 'app-products-dashboard',
  imports: [CommonModule],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.css',
})
export class ProductsDashboardComponent implements OnInit {
  private readonly _ProductsServices = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  productsList: any[] = [];
  categories: any[] = [];

  ngOnInit(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (categoryRes: any) => {
        this.categories = categoryRes.data;

        // Now fetch products after categories are ready
        this.fetchAllProducts();
      },
      error: (err) => {
        console.log('Failed to load categories', err);
      },
    });
    this.fetchAllProducts();
  }
  // fetchAllProducts() {
  //   this._ProductsServices.getAllProducts().subscribe({
  //     next: (res: any) => {
  //       this.productsList = res.data;
  //       console.log(res.data);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
  fetchAllProducts() {
    this._ProductsServices.getAllProducts().subscribe({
      next: (res: any) => {
        this.productsList = res.data.map((product: any) => {
          const category = this.categories.find(
            (cat) => cat._id === product.categoryID
          );
          return {
            ...product,
            categoryName: category?.name || 'Unknown',
          };
        });

        console.log(this.productsList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
