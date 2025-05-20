import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { ProductsComponent } from '../products/products.component';
import { ToastService } from '../../../services/toast.service';
import { PaginationComponent } from '../sharedComponents/pagination/pagination.component';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-products-category',
  imports: [ProductsComponent, PaginationComponent],
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
        this.productsList = res.data;
        this.totalPages = res.totalPages;
        this.filteredProductsList = [...this.productsList];

        this.filteredProductsList = res.data.map((item: any) => ({
          ...item,
          isInWishlist: this.isInWishlistArr.includes(item._id),
        }));
        console.log(this.filteredProductsList);

        if (this.categoryName !== 'all' && this.productsList.length) {
          this.currentCategoryId = this.productsList[0].categoryID._id;
        } else {
          this.currentCategoryId = null;
        }
      },
      error: (err) => console.log(err),
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
    const fullQuery: any = { ...filterQuery };
    this.isFiltered = true;
    if (resetPage) this.currentPage = 1;
    // Add category to the query
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
        this.filteredProductsList = res.data;
        this.totalPages = res.totalPages;
      },
      error: (err) => {
        console.error('Filter Error status =', err.status);
        console.error('Filter Error body =', err.error);
        this._ToastService.show('error', err.error.message);
      },
    });
  }
}
