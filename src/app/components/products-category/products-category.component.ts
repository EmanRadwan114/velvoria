import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { ProductsComponent } from '../products/products.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-products-category',
  imports: [ProductsComponent],
  templateUrl: './products-category.component.html',
  styleUrl: './products-category.component.css',
})
export class ProductsCategoryComponent implements OnInit {
  productsList: any[] = [];
  filteredProductsList: any[] = [];
  categoryName = '';
  currentCategoryId: string | null = null;

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly  _ToastService=inject(ToastService)

  constructor(private prdServices: ProductsService) {}

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        const category = p.get('category');
        this.categoryName = category || 'all';
        this.fetchProducts();
      },
      error: (err) => console.log(err),
    });
  }

  private fetchProducts(): void {
    const obs =
      this.categoryName === 'all'
        ? this.prdServices.getAllProducts()
        : this.prdServices.getProductByCategory(this.categoryName);

    obs.subscribe({
      next: (res: any) => {
        this.productsList = res.data;
        this.filteredProductsList = [...this.productsList];

        if (this.categoryName !== 'all' && this.productsList.length) {
          this.currentCategoryId = this.productsList[0].categoryID._id;
        } else {
          this.currentCategoryId = null;
        }
      },
      error: (err) => console.log(err),
    });
  }

  handleFilterChange(filterQuery: any): void {
    const fullQuery: any = { ...filterQuery };
    if (this.currentCategoryId) {
      fullQuery.category = this.currentCategoryId;
    }

    console.log('Full filter query:', fullQuery);

    this.prdServices.filterProducts(fullQuery).subscribe({
      next: (res: any) => {
        this.filteredProductsList = res.data;
      },
      error: (err) => { console.error('Filter Error status =', err.status);
      console.error('Filter Error body =', err.error);
      this._ToastService.show('error', err.error.message);      
     },
    });
  }
}