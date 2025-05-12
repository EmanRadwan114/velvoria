import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-products-category',
  imports: [ProductsComponent],
  templateUrl: './products-category.component.html',
  styleUrl: './products-category.component.css',
})
export class ProductsCategoryComponent implements OnInit {
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
          this.prdServices.getProductByCategory(this.categoryName).subscribe({
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
  }
}
