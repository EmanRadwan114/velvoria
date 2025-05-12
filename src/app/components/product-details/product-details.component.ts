import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../services/categories.service';
import { ReviewsComponent } from '../reviews/reviews.component';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, ReviewsComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  // ActivatedRoute service return info of routing
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);

  mainImage: string = '';
  detailsProduct: any = {};
  categoryID: string = '';
  categoryName: string = '';
  category: any = {};

  ngOnInit(): void {
    this._ActivatedRoute.paramMap
      .subscribe(p => {
        const productID = p.get('id')!;
        // 1) fetch product
        this._ProductsService.getSpecificProduct(productID)
          .subscribe({
            next: (res: any) => {
              this.detailsProduct = res.data[0];
              this.categoryID    = this.detailsProduct.categoryID;
              this.mainImage     = this.detailsProduct.thumbnail;
  
              // 2) now that categoryID is set, fetch category
              this._CategoriesService.getSpecificCategry(this.categoryID)
                .subscribe({
                  next: (catRes: any) => {
                    this.categoryName = catRes.data.name;
                    console.log('Category Name:', this.categoryName);
                  },
                  error: err => console.error('Category API Error:', err)
                });
            },
            error: err => console.error('Product API Error:', err)
          });
      });
  }
}