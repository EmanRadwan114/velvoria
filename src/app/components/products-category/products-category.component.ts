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
  //   productsList: object[] = [];
  //   filteredProductsList: object[] = [];
  //   categoryName = '';

  //   private readonly _ActivatedRoute = inject(ActivatedRoute);

  //   constructor(private prdServices: ProductsService) {}

  //   ngOnInit(): void {
  //     this._ActivatedRoute.paramMap.subscribe({
  //       next: (p) => {
  //         const category = p.get('category');
  //         this.categoryName = category || 'all';
  //         this.fetchProducts();
  //       },
  //       error: (err) => console.log(err),
  //     });
  //   }

  //   private fetchProducts(): void {
  //     const obs =
  //       this.categoryName === 'all'
  //         ? this.prdServices.getAllProducts()
  //         : this.prdServices.getProductByCategory(this.categoryName);

  //     obs.subscribe({
  //       next: (res: any) => {
  //         this.productsList = res.data;
  //         this.filteredProductsList = [...this.productsList];
  //       },
  //       error: (err) => console.log(err),
  //     });
  //   }

  //   // /** Called when ProductsComponent emits filterChanged */
  //   // handleFilterChange(filterQuery: any): void {
  //   //   console.log('Category got filter:', filterQuery);
  //   //   this.prdServices.filterProducts(filterQuery).subscribe({
  //   //     next: (res: any) => (this.filteredProductsList = res.data),
  //   //     error: (err) => console.log(err),
  //   //   });
  //   // }}
  //   /** Called when ProductsComponent emits filterChanged */
  // handleFilterChange(filterQuery: any): void {
  //   // 1) Merge in the category
  //   const fullQuery = {

  //     category: this.categoryName !== 'all' ? this.categoryName : null,
  //     ...filterQuery
  //   };

  //   console.log('Full filter query:', fullQuery);

  //   // 2) Call the same filter endpoint with category + other filters
  //   this.prdServices.filterProducts(fullQuery).subscribe({
  //     next: (res: any) => this.filteredProductsList = res.data,
  //     error: (err) => console.log(err),
  //   });
  // }
  // }
  productsList: any[] = [];
  filteredProductsList: any[] = [];
  categoryName = '';
  /** Hold the Mongo _id of the current category (null when “all”) */
  currentCategoryId: string | null = null;

  private readonly _ActivatedRoute = inject(ActivatedRoute);

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

        // Capture the _id of the current category (populated by your backend)
        if (this.categoryName !== 'all' && this.productsList.length) {
          // the backend did: .populate('categoryID'), so categoryID is an object
          this.currentCategoryId = this.productsList[0].categoryID._id;
        } else {
          this.currentCategoryId = null;
        }
      },
      error: (err) => console.log(err),
    });
  }

  /** Called when ProductsComponent emits filterChanged */
  handleFilterChange(filterQuery: any): void {
    // Build the full query: include category _id if present
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
      // optionally show user a friendly message
      alert(err.error?.message || 'Something went wrong on the server');},
    });
  }
}