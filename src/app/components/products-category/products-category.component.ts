import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { ProductsComponent } from '../products/products.component';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { WishlistService } from '../../../services/wishlist.service';
import { CommonModule } from '@angular/common';
import { LoadingSPinnerComponent } from '../sharedComponents/loading-spinner/loading-spinner.component';
import { FilterationComponent } from '../filteration/filteration.component';

@Component({
  selector: 'app-products-category',
  imports: [
    ProductsComponent,
    PaginationComponent,
    CommonModule,
    LoadingSPinnerComponent,
    FilterationComponent,
  ],
  templateUrl: './products-category.component.html',
})
export class ProductsCategoryComponent implements OnInit {
  productsList: any[] = [];
  filteredProductsList: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  categoryName = '';
  isFiltered = false;
  lastFilterQuery: any = {};
  currentCategoryId: string | null = null;

  isInWishlistArr: string[] = [];

  message = 'loading'; // default

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ToastService = inject(ToastService);

  constructor(
    private prdServices: ProductsService,
    private _WishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // First load wishlist, then fetch products
    this._WishlistService.getAllWishList().subscribe({
      next: (res: any) => {
        this.isInWishlistArr = res.wishlist.map((item: any) => item._id);

        this._ActivatedRoute.paramMap.subscribe({
          next: (p) => {
            const category = p.get('category');
            this.categoryName = category || 'all';

            // Reset relevant values when changing category
            this.currentPage = 1;
            this.isFiltered = false;
            this.lastFilterQuery = {};

            this.fetchProducts();
          },
          error: (err) => console.log(err),
        });

        console.log(this.isInWishlistArr);
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
      },
    });
  }

  private fetchProducts(): void {
    this.isFiltered = false;
    const obs =
      this.categoryName === 'all'
        ? this.prdServices.getAllProducts(this.currentPage)
        : this.prdServices.getProductByCategory(
            this.categoryName,
            this.currentPage
          );

    obs.subscribe({
      next: (res: any) => {
        if (!res.data || res.data.length === 0) {
          this.message = 'No products found in this category';
          this.filteredProductsList = [];
          this.totalPages = res.totalPages || 1;
          this.currentPage = res.currentPage || 1;
          return;
        }

        this.productsList = res.data;
        this.totalPages = res.totalPages || 1;
        this.currentPage = res.currentPage || 1;
        this.filteredProductsList = res.data.map((item: any) => ({
          ...item,
          isInWishlist: this.isInWishlistArr.includes(item._id),
        }));

        this.message = 'success';

        if (this.categoryName !== 'all' && this.productsList.length) {
          this.currentCategoryId = this.productsList[0].categoryID._id;
        } else {
          this.currentCategoryId = null;
        }
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.message = 'Failed to load products';
      },
    });
  }

  changePage(page: any): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    if (this.isFiltered) {
      this.handleFilterChange(this.lastFilterQuery, false);
    } else {
      this.fetchProducts();
    }
  }

  handleFilterChange(filterQuery: any, resetPage = true): void {
    const isClearingFilter = Object.values(filterQuery).every(
      (val) => val === 'all' || val === null || val === undefined
    );

    if (isClearingFilter) {
      // User selected "All" -> clear filter
      this.isFiltered = false;
      this.lastFilterQuery = {};
      if (resetPage) this.currentPage = 1;
      this.fetchProducts();
      return;
    }

    const fullQuery: any = { ...filterQuery };
    this.isFiltered = true;
    if (resetPage) this.currentPage = 1;

    if (this.currentCategoryId) {
      fullQuery.category = this.currentCategoryId;
    }

    Object.keys(fullQuery).forEach((key) => {
      if (
        fullQuery[key] === null ||
        fullQuery[key] === undefined ||
        fullQuery[key] === 'all'
      ) {
        delete fullQuery[key];
      }
    });

    this.lastFilterQuery = fullQuery;

    this.prdServices.filterProducts(fullQuery, this.currentPage).subscribe({
      next: (res: any) => {
        if (!res.data || res.data.length === 0) {
          this.message = 'No products were found matching your selection';
          this.filteredProductsList = [];
          this.totalPages = 1;
          return;
        }

        this.filteredProductsList = res.data.map((item: any) => ({
          ...item,
          isInWishlist: this.isInWishlistArr.includes(item._id),
        }));

        console.log(res);

        this.totalPages = res.totalPages || 1;
        this.message = 'success';
      },
      error: (err) => {
        console.error('Filter Error status =', err.status);
        console.error('Filter Error body =', err.error);
        this.message = 'No products were found matching your selection';
        this.filteredProductsList = [];
        this._ToastService.show(
          'error',
          err.error.message || 'Error fetching data'
        );
      },
    });
  }
}
