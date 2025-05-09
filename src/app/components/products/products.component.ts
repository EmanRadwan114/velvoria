import { Component, inject, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../services/products.service';
import { FilterationComponent } from '../filteration/filteration.component';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from "../sharedComponents/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, CommonModule, FilterationComponent, BreadcrumbComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.css',
})
export class ProductsComponent implements OnInit {
  productsList: object[] = [];
  filteredProductsList: object[] = [];
  categoryName = '';

  private readonly _ActivatedRoute = inject(ActivatedRoute);

  constructor(private prdServices: ProductsService) {}

ngOnInit(): void {
  this._ActivatedRoute.paramMap.subscribe({
    next: (p) => {
      const category = p.get('category');
      this.categoryName = category || 'all';

      if (this.categoryName === 'all') {
        // Get All Products
        this.prdServices.getAllProducts().subscribe({
          next: (res: any) => {
            this.productsList = res.data;
            this.filteredProductsList = [...this.productsList];
          },
          error: (err) => console.log(err),
        });
      } else {
        // Get Products by Category
        this.prdServices.getProducdByCategory(this.categoryName).subscribe({
          next: (res: any) => {
            this.productsList = res.data;
            this.filteredProductsList = [...this.productsList];
          },
          error: (err) => console.log(err),
        });
      }
    },
    error: (err) => console.log(err),
  });
}}
